````md

<script setup>
import { onMounted, ref } from 'vue';

 const name = ref('mahmoud');
 const status= ref('active');
 const tasks = ref(['task 1', 'task2', 'task3']);
 const newTask = ref('');


 const togglleStatues =()=>{
  if(status.value === 'active' )
  { status.value ='pending'
  } else if(status.value==='pending')
  {status.value='inactive'}
  else{status.value='active'}
 };
 const addTask =() =>{
  if(newTask.value.trim()!==""){
    tasks.value.push(newTask.value)
    newTask.value='';
  };
 };
 const deleteTask =(index)=>{
  tasks.value.splice(index,1);
 }
 onMounted(async()=>{
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    tasks.value = data.map((task) => task.title);
  } catch (error) {
    console.log('error')
  }
 });
</script>
<template>
 <h1>{{ name }}</h1>
 <p v-if="status === 'active'">user is active</p>
 <p v-else-if="status === 'pending'">user is pending</p>
 <p v-else>user is active</p>

<form @submit.prevent="addTask">
  <label for="newTask">add task</label>
  <input type="text" id="newTask" name="newTask" v-model="newTask">
  <button type="submit">Submit</button>
</form>

<h2>Tasks :</h2>
<ul>
  <li v-for="(task, index) in tasks":key="task">
   <span>
     {{ task }}
   </span>
   <button @click="deleteTask(index)">Delete</button>
  </li>
</ul>
<button @click="togglleStatues">
  bresss me
</button>
</template>
```
tailwind v4 has special new command
npm install -D tailwindcss @tailwindcss/vite
```
# Vue v-for Not Rendering — Problem & Solution

## Problem

A Vue component using `v-for` was not rendering list items when iterating over imported JSON data.

### Code (Problematic)

```vue
<script setup>
import jobData from "@/jobs.json";
import { ref } from "vue";

const jobs = ref(jobData);
</script>

<template>
  <section class="bg-green-300 grid grid-cols-1">
    <div v-for="job in jobs" :key="job.id">
      {{ job.title }}
    </div>
  </section>
</template>
````

### Console Output

```js
jobs.value === {
  jobs: [ /* array of 6 job objects */ ]
}
```

---

## Root Cause

* `jobData` is **not an array**
* It is an **object containing a `jobs` array**
* `v-for` expects an array, but received an object instead

Incorrect assumption:

```js
jobData === []
```

Actual structure:

```js
jobData === {
  jobs: []
}
```

---

## Solution

Point the ref directly to the array inside the object.

### Correct Code (Recommended)

```vue
<script setup>
import jobData from "@/jobs.json";
import { ref } from "vue";

const jobs = ref(jobData.jobs);
</script>

<template>
  <section class="bg-green-300 grid grid-cols-1">
    <div v-for="job in jobs" :key="job.id">
      {{ job.title }}
    </div>
  </section>
</template>
```

---

## Alternative (Less Clean)

Access the nested array in the template:

```vue
<div v-for="job in jobs.jobs" :key="job.id">
```

---

## Key Takeaways

* Always inspect imported JSON with `console.log`
* `v-for` must iterate over an **array**
* Match your Vue state to the **actual data structure**
* Prefer flattening data in `script setup`, not templates

---

## Debug Tip

```js
console.log(jobData);
console.log(Array.isArray(jobData));
```

This immediately reveals structural issues.

```
````md
# Vue Reactivity Pitfall: `ref` vs `reactive`

## Problem Summary

A common Vue 3 error happens when **`ref` and `reactive` are mixed or used incorrectly**, especially when storing objects.

This leads to:
- State not updating
- UI not rendering
- Confusing bugs with `.value`

---

## Root Cause

### Using `ref` with an object:
```js
const state = ref({
  jobs: [],
  isLoading: true,
});
````

The object is wrapped inside `.value`.

❌ Incorrect access:

```js
state.jobs = data
state.jobs.value = data
state.isLoading.value = false
```

✔ Correct access:

```js
state.value.jobs = data
state.value.isLoading = false
```

---

## Why Templates Seem to “Work”

Vue **auto-unwraps refs in templates**, so this works:

```vue
state.jobs
state.isLoading
```

But **scripts do NOT auto-unwrap**, which causes confusion.

---

## Correct Usage Rules

### `ref`

Use when:

* Storing primitives (`number`, `string`, `boolean`)
* You need `.value`

```js
const count = ref(0);
count.value++;
```

For objects:

```js
state.value.jobs = data;
```

---

### `reactive` (Recommended for objects)

Use when:

* Managing objects or complex state
* You want cleaner syntax

```js
const state = reactive({
  jobs: [],
  isLoading: true,
});

state.jobs = data;
state.isLoading = false;
```

❗ Never use `.value` with `reactive`

---

## Common Mistakes

| Mistake                              | Result           |
| ------------------------------------ | ---------------- |
| `state.jobs.value`                   | ❌ breaks         |
| `state.isLoading.value`              | ❌ breaks         |
| Mixing `ref` rules with `reactive`   | ❌ unstable state |
| Using `ref(object)` without `.value` | ❌ silent failure |

---

## Best Practice Recommendation

✔ Use **`reactive` for objects**
✔ Use **`ref` for primitives**
✔ Do not mix access patterns

---

## Final Rule (Memorize This)

> **`ref` → `.value`**
> **`reactive` → no `.value`**

---

## Conclusion

Most Vue reactivity bugs are **not Vue bugs** — they are **`.value` mistakes**.
Choosing the correct API (`ref` vs `reactive`) prevents 90% of these issues.

---
