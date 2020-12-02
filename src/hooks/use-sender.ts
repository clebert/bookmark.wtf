import {createSenderHook} from 'loxia';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

export const useSender = createSenderHook({
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
});
