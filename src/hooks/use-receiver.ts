import {createReceiverHook} from 'loxia';
import {useEffect, useMemo, useRef, useState} from 'preact/hooks';

export const useReceiver = createReceiverHook({
  useEffect,
  useMemo,
  useRef,
  useState,
});
