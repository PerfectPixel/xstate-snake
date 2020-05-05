import { interpret } from 'xstate';
import { from, ObservableInput, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { GameMachine } from './GameMachine';
import { Renderer } from './Renderer';
import { DIRECTION_KEYS } from './constants';

const renderer = new Renderer();

const service = interpret(GameMachine, {
  execute: false,
})
  .onTransition((state) => {
    requestAnimationFrame(() => service.execute(state));
  })
  .start();
const state$ = from(service as ObservableInput<typeof service['state']>);

const resetButton = document.getElementById('reset');
resetButton?.addEventListener('click', () => service.send('RESET'));

const scoreElement = document.getElementById('score')!;

state$.subscribe((state) => {
  const { food, snake, score } = state.context;

  if (state.matches('over')) {
    resetButton?.removeAttribute('disabled');
  } else {
    resetButton?.setAttribute('disabled', 'true');
  }

  scoreElement.innerText = `${score}`;

  renderer.render(food, snake);
});

fromEvent<KeyboardEvent>(document, 'keydown')
  .pipe(
    map((event) => event.keyCode),
    map((keyCode) => DIRECTION_KEYS[keyCode]),
    filter(Boolean)
  )
  .subscribe((direction) => service.send('DIRECTION', { direction }));
