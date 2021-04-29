import { PreviewText } from '@formily/react-shared-components';

export const mapTextComponent = (
  Target: React.JSXElementConstructor<any>,
  props: any,
  fieldProps: any = {},
): React.JSXElementConstructor<any> => {
  const { editable } = fieldProps;
  if (editable !== undefined) {
    if (editable === false) {
      return PreviewText;
    }
  }
  return Target;
};

export const mapStyledProps = (props: any, fieldProps: any) => {
  const { loading, errors } = fieldProps;
  if (loading) {
    // eslint-disable-next-line
    props.state = props.state || 'loading';
  } else if (errors && errors.length) {
    // eslint-disable-next-line
    props.state = 'error';
  }
};
