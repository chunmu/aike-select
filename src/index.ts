import { connect } from '@formily/react-schema-renderer';
import Select, { ExportedSelectProps as SelectProps } from './Select';
import { RefSelectProps } from './generate';
import Option from './Option';
import OptGroup from './OptGroup';
import { mapTextComponent, mapStyledProps } from './utils/index';

import AikeSelect from './AikeSelect';

const FormilyAikeSelect = connect({
  getProps: mapStyledProps,
  getComponent: mapTextComponent,
})(AikeSelect);

export { Option, OptGroup, SelectProps, RefSelectProps, AikeSelect, FormilyAikeSelect };
export default Select;
