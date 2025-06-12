import { type Itr1 } from './itr-1';
import { type Itr2 } from './itr';

/**
 * This isn't auto generated. This is created to avoid circular dependency between itr.ts and itr-1.ts (which are auto generated).
 * itr-1.ts imports itr.ts and common-itr.ts.
 * itr.ts imports common-itr.ts.
 */
export interface Itr {
    ITR?: ITRClass;
}

/**
 * This is root node. It can contain either an ITR1 or an ITR2 object.
 */
export interface ITRClass {
    ITR1?: Itr1;
    ITR2?: Itr2;
} 