declare module 'lottie-react-native' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  interface LottieViewProps extends ViewProps {
    source: any;
    autoPlay?: boolean;
    loop?: boolean;
    style?: any;
  }

  export default class LottieView extends React.Component<LottieViewProps> {}
}
