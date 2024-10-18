import { helper } from '@ember/component/helper';

export default helper(function getYear([param, ...rest]) {
  const d = new Date(param);
  return d.getFullYear();
});
