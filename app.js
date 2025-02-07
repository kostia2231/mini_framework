let activeEffect = null;

// signal state
function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  const get = () => {
    if (activeEffect) subscribers.add(activeEffect);
    return value;
  };

  const set = (newValue) => {
    value = newValue;
    subscribers.forEach((effect) => effect());
  };

  return [get, set];
}

// effect
function createEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

// render func
function render(component, rootElement) {
  const updateDOM = () => {
    rootElement.innerHTML = component();
  };
  createEffect(updateDOM);
}

// component.js
function Component() {
  const greeting = "Hallochen World";
  return `
  <div>${greeting}</div>
  `;
}

// app.js
const [count, setCount] = createSignal(0);

function Counter() {
  return `
    <div>
      ${Component()}
      <div>Coudsdnt: ${count()}</div>
      <button data-action="increment">Increment</button>
    </div>
  `;
}

//  init
const root = document.getElementById("root");
render(Counter, root);

//  event handling
root.addEventListener("click", (e) => {
  if (e.target.dataset.action === "increment") {
    setCount(count() + 1);
  }
});
