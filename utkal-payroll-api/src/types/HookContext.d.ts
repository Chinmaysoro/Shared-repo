import { HookContext } from '@feathersjs/feathers';

export type HookFunction = (context: HookContext) => HookContext;
