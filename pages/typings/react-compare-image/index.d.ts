declare module "react-compare-image" {
  export default class ReactCompareImage extends React.Component<{
    aspectRatio?: string;
    handle?: React.ReactElement;
    handleSize?: number;
    hover?: boolean;
    leftImage: string;
    leftImageAlt?: string;
    leftImageCss?: React.CSSProperties;
    leftImageLabel?: string;
    onSliderPositionChange?: (position: number) => void;
    rightImage: string;
    rightImageAlt?: string;
    rightImageCss?: React.CSSProperties;
    rightImageLabel?: string;
    skeleton?: React.ReactElement;
    sliderLineColor?: string;
    sliderLineWidth?: number;
    sliderPositionPercentage?: number;
    vertical?: boolean;
  }> {}
}
