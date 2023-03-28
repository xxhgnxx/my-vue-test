import { useDialogInstance } from '../dialogComponentTools';
import ComBody2 from './ComBody.vue';

const ComBody = () => import(/* webpackChunkName: "hgn_TB" */ './ComBody.vue');

const { creator, close } = useDialogInstance<boolean, {a:string|null}>(
  ComBody,
  false,
);
const createDialog = (a = '') => creator({ a }).deferred;

export { createDialog, close };
