
type VariantMap = Record<string, Record<string, string>>;

type VariantValues<T extends VariantMap> = {
  [K in keyof T]?: keyof T[K];
};

// Generates CSS classes based on the selected variants.
export function createVariants<const T extends VariantMap>(
  config: {
    base: string;
    variants: T;
    defaultVariants?: VariantValues<T>;
  }
) {
  return (
    options: VariantValues<T> = {},
    className = ""
  ) => {
    const classes = [config.base];

    for (const key of Object.keys(config.variants) as Array<keyof T>) {
      const value = options[key] ?? config.defaultVariants?.[key];

      if (value !== undefined) {
        const cssClass =
          config.variants[key][value as keyof T[typeof key]];

        if (cssClass) classes.push(cssClass);
      }
    }

    if (className) classes.push(className);

    return classes.join(" ");
  };
}

export type VariantProps< T extends (options?: any, className?: string) => string> = NonNullable<Parameters<T>[0]>;
