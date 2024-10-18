import { helper } from '@ember/component/helper';

export default helper(function convertToMinutes([param, ...rest]) {
  var milisec = parseInt(param);
  var minutes = Math.floor(milisec / 60000);
  var seconds = ((milisec % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  /* return minutes + ":" + (seconds < 10 ? '0' : '') + seconds; */
});
