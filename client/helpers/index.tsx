import { cn } from '@/lib/utils';

import { TooltipWrapper } from '@/components/ui/info/tooltip-wrapper';

export const renderIconText = (
  {
    id,
    icon,
    text,
    tooltip,
  }: {
    id: number;
    icon: React.ReactNode;
    text: string;
    tooltip?: string;
  },
  customStyles?: {
    div?: string;
    icon?: string;
    p?: string;
  },
) => {
  const content = (
    <div key={id} className={`flex items-center gap-2 ${customStyles?.div}`}>
      <span className={`${customStyles?.icon}`}>{icon}</span>
      <p className={`text-muted-foreground font-light ${customStyles?.p}`}>
        {text}
      </p>
    </div>
  );

  return tooltip ? (
    <TooltipWrapper tooltip={tooltip}>{content}</TooltipWrapper>
  ) : (
    content
  );
};

type FieldGroupProps =
  | {
      title: string;
      value: string | number;
      autoLink?: boolean;
      children?: undefined;
    }
  | {
      title: string;
      children: React.ReactNode;
    };

export const FieldGroup: React.FC<
  FieldGroupProps & {
    customStyles?: {
      h1?: string;
      p?: string;
      a?: string;
      div?: string;
    };
  }
> = (props) => {
  const { title, customStyles } = props;

  const content = (() => {
    if ('children' in props) {
      return <div>{props.children}</div>;
    }

    const { value, autoLink } = props;
    const isHttpLink =
      autoLink && typeof value === 'string' && value.startsWith('http');

    if (isHttpLink) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={cn('text-blue-500 dark:text-blue-500', customStyles?.a)}
        >
          {value}
        </a>
      );
    }

    return (
      <p
        className={cn(
          'text-muted-foreground text-base truncate',
          customStyles?.p,
        )}
      >
        {value}
      </p>
    );
  })();

  return (
    <div className={cn('flex flex-col gap-2', customStyles?.div)}>
      <h2 className={cn('', customStyles?.h1)}>{title}</h2>
      {content}
    </div>
  );
};
