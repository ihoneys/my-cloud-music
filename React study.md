## useCallback 使用场景
```jsx

const handleBack = useCallback (() => {
  setShowStatus (false);
}, []);


<Parent handleClick={handleBack}></Parent>
```
父组件传给子组件的函数使用 useCallback 包裹，父组件每次执行时会生成不一样的 handleBack 函数引用，那么子组件每次 memo的结果都不一样，导致不必要的渲染，也就浪费了memo的价值

