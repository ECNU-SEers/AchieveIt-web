import _ from "lodash";

export const generateEmptyArrayByLength = length => _.fill(new Array(length), undefined);
