export const formatFieldName = (fieldName: string): string => {
    return fieldName
      .split(/[_\s]/)
      .flatMap(word => word.split(/(?=[A-Z])/))
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  