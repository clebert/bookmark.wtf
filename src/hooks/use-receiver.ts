import {createReceiverHook} from 'loxia';
import {useEffect, useMemo, useRef, useState} from 'react';

export const useReceiver = createReceiverHook({
  useEffect,
  useMemo,
  useRef,
  useState,
});
