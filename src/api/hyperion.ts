/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* Reference for Hyperion endpoints: https://rpc1.us.telos.net/v2/docs/static/index.html#/ */
import axios from 'axios';
import { ActionData, Action } from 'src/types';

const hyperion = axios.create({ baseURL: process.env.HYPERION_ENDPOINT });

export const getAccount = async function (address: string): Promise<any> {
  return await hyperion.get('v2/state/get_account', {
    params: { account: address }
  });
};

export const getTransactions = async function (
  address?: string
): Promise<Action[]> {
  const response = await hyperion.get<ActionData>('v2/history/get_actions', {
    params: { limit: 100, account: address, 'act.name': '!onblock' }
  });
  return response.data.actions;
};

export const getTransaction = async function (
  address?: string
): Promise<Action[]> {
  const response = await hyperion.get<ActionData>(
    'v2/history/get_transaction',
    {
      params: { id: address }
    }
  );
  return response.data.actions;
};