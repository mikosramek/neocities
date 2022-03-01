
const getDaysSince = (targetDateString) => {
  const now = new Date();
  const then = new Date(targetDateString);
  const millis = now.getTime() - then.getTime();
  return(millis / (1000*3600*24));
}

module.exports = {
  getDaysSince
};
