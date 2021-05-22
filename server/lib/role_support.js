const requireInstructor = async (req, res, next) => {
  if (!req.currentUser) {
    res.status(403).send('An error occurred, no current user present');
    return;
  }
  const isInstructor = await req.currentUser.isInstructor(req.jwtBody.context_id);
  if (!isInstructor) {
    res.status(401).send('You are not authorized to access this page');
    return;
  }
  next();
}

const requireInstructorOrTA = async (req, res, next) => {
  if (!req.currentUser) {
    res.status(403).send('An error occurred, no current user present');
    return;
  }
  const isInstructor = await req.currentUser.isInstructor(req.jwtBody.context_id);
  const isTA = await req.currentUser.isTA(req.jwtBody.context_id);
  if (!isInstructor && !isTA) {
    res.status(401).send('You are not authorized to access this page');
    return
  }
  next();
}

module.exports = {
  requireInstructor,
  requireInstructorOrTA,
}
