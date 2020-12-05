import {createSenderHook} from 'loxia';
import {useCallback, useEffect, useMemo, useRef, useState} from 'preact/hooks';

export const useSender = createSenderHook({
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
});
