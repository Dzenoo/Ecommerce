'use client';

import * as loaders from 'react-spinners';

type LoaderType = keyof typeof loaders;

type LoaderPropsMap = {
  [K in LoaderType]: { type: K } & React.ComponentProps<(typeof loaders)[K]>;
};

type LoaderProps = LoaderPropsMap[LoaderType];

const Loader: React.FC<LoaderProps> = (props) => {
  const { type, ...rest } = props;

  const SelectedLoader = loaders[type];

  if (!SelectedLoader) {
    console.error(`Loader type "${type}" not found in react-spinners.`);
    return null;
  }

  return <SelectedLoader {...rest} />;
};

export default Loader;
