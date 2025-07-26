declare module "react-native-modal-datetime-picker" {
  import React from "react";
  import { DateTimePickerProps } from "@react-native-community/datetimepicker";

  export interface DateTimePickerModalProps extends DateTimePickerProps {
    isVisible: boolean;
    mode?: 'date' | 'time' | 'datetime';
    minimumDate?: Date;
    maximumDate?: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
  }

  const DateTimePickerModal: React.FC<DateTimePickerModalProps>;
  export default DateTimePickerModal;
}
