// TODO: 4.0 - codemod should help to change `filterOption` to support node props.

import * as React from 'react';
import omit from 'rc-util/lib/omit';
import classNames from 'classnames';
// eslint-disable-next-line
import RcSelect, { ExportedSelectProps as RcSelectProps } from './Select';
import Option from './Option';
import OptGroup from './OptGroup';
import { OptionProps } from './Option';
import { ConfigContext } from 'antd/lib/config-provider';
import getIcons from './utils/iconUtil';
// eslint-disable-next-line
import SizeContext, { SizeType } from 'antd/lib/config-provider/SizeContext';
import { getTransitionName } from 'antd/lib/_util/motion';
import { connect, mapReadPretty, mapProps } from '@formily/react';
import { LoadingOutlined } from '@ant-design/icons';
import { PreviewText } from '@formily/antd';

type RawValue = string | number;

export { OptionProps };

export type OptionType = typeof Option;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: React.ReactNode;
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;

export interface InternalSelectProps<VT> extends Omit<RcSelectProps<VT>, 'mode'> {
  suffixIcon?: React.ReactNode;
  size?: SizeType;
  mode?: 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
  bordered?: boolean;
}

export interface SelectProps<VT>
  extends Omit<InternalSelectProps<VT>, 'inputIcon' | 'mode' | 'getInputElement' | 'backfill'> {
  mode?: 'multiple' | 'tags';
}

export interface RefSelectProps {
  focus: () => void;
  blur: () => void;
}

const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';

const InternalSelect = <VT extends SelectValue = SelectValue>(
  {
    prefixCls: customizePrefixCls,
    bordered = true,
    className,
    getPopupContainer,
    dropdownClassName,
    listHeight = 256,
    listItemHeight = 24,
    size: customizeSize,
    notFoundContent,
    ...props
  }: SelectProps<VT>,
  ref: React.Ref<RefSelectProps>,
) => {
  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
    direction,
    virtual,
    dropdownMatchSelectWidth,
  } = React.useContext(ConfigContext);
  const size = React.useContext(SizeContext);

  const prefixCls = getPrefixCls('select', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();

  const mode = React.useMemo(() => {
    const { mode: m } = props as InternalSelectProps<VT>;

    if ((m as any) === 'combobox') {
      return undefined;
    }

    if (m === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
      return 'combobox';
    }

    return m;
    // eslint-disable-next-line
  }, [props.mode]);

  const isMultiple = mode === 'multiple' || mode === 'tags';

  // ===================== Empty =====================
  let mergedNotFound: React.ReactNode;
  if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent;
  } else if (mode === 'combobox') {
    mergedNotFound = null;
  } else {
    mergedNotFound = renderEmpty('Select');
  }

  // ===================== Icons =====================
  const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons({
    ...props,
    multiple: isMultiple,
    prefixCls,
  });

  const selectProps = omit(props as typeof props & { itemIcon: any }, ['suffixIcon', 'itemIcon']);

  const rcSelectRtlDropDownClassName = classNames(dropdownClassName, {
    [`${prefixCls}-dropdown-${direction}`]: direction === 'rtl',
  });

  const mergedSize = customizeSize || size;
  const mergedClassName = classNames(
    {
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-borderless`]: !bordered,
    },
    className,
  );

  return (
    <RcSelect<VT>
      ref={ref as any}
      virtual={virtual}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      {...selectProps}
      transitionName={getTransitionName(rootPrefixCls, 'slide-up', props.transitionName)}
      listHeight={listHeight}
      listItemHeight={listItemHeight}
      mode={mode}
      prefixCls={prefixCls}
      direction={direction}
      inputIcon={suffixIcon}
      menuItemSelectedIcon={itemIcon}
      removeIcon={removeIcon}
      clearIcon={clearIcon}
      notFoundContent={mergedNotFound}
      className={mergedClassName}
      getPopupContainer={getPopupContainer || getContextPopupContainer}
      dropdownClassName={rcSelectRtlDropDownClassName}
    />
  );
};

const SelectRef = React.forwardRef(InternalSelect) as <VT extends SelectValue = SelectValue>(
  props: SelectProps<VT> & { ref?: React.Ref<RefSelectProps> },
) => React.ReactElement;

type InternalSelectType = typeof SelectRef;

interface SelectInterface extends InternalSelectType {
  SECRET_COMBOBOX_MODE_DO_NOT_USE: string;
  Option: typeof Option;
  OptGroup: typeof OptGroup;
}

const Select = SelectRef as SelectInterface;

Select.SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE;
Select.Option = Option;
Select.OptGroup = OptGroup;

export const FormilyAntdSelect = connect(
  Select,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon:
          (field as any)?.loading || (field as any)?.validating ? (
            <LoadingOutlined />
          ) : (
            props.suffixIcon
          ),
      };
    },
  ),
  mapReadPretty(PreviewText.Select),
);

export default Select;
