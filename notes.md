````md
## notes and problems I faced

### component code

```vue
<script setup>
import { onMounted, ref } from 'vue';

const name = ref('mahmoud');
const status = ref('active');
const tasks = ref(['task 1', 'task2', 'task3']);
const newTask = ref('');

const togglleStatues = () => {
  if (status.value === 'active') {
    status.value = 'pending';
  } else if (status.value === 'pending') {
    status.value = 'inactive';
  } else {
    status.value = 'active';
  }
};

const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push(newTask.value);
    newTask.value = '';
  }
};

const deleteTask = (index) => {
  tasks.value.splice(index, 1);
};

onMounted(async () => {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos'
    );
    const data = await response.json();
    tasks.value = data.map((task) => task.title);
  } catch (error) {
    console.log('error');
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
    <input
      type="text"
      id="newTask"
      name="newTask"
      v-model="newTask"
    />
    <button type="submit">Submit</button>
  </form>

  <h2>Tasks :</h2>

  <ul>
    <li v-for="(task, index) in tasks" :key="task">
      <span>{{ task }}</span>
      <button @click="deleteTask(index)">Delete</button>
    </li>
  </ul>

  <button @click="togglleStatues">
    bresss me
  </button>
</template>
````

---

### notes

* `ref` is used correctly for strings, arrays, and inputs
* `.value` is required in `<script setup>` but **not** in the template
* `onMounted` replaces the initial `tasks` array with API data
* `v-for` works because `tasks` is always an array

---

### small problems

* typo in function name: `togglleStatues`
* typo in button text: `bresss me`
* `:key="task"` works only if task titles are unique

Safer option:

```vue
:key="index"
```

---

## tailwind v4 note

Tailwind v4 has a new install command (Vite):

```bash
npm install -D tailwindcss @tailwindcss/vite
```

---

# Vue v-for Not Rendering — Problem & Solution

## problem

`v-for` was not rendering items when looping over imported JSON data.

### problematic code

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
```

### console output

```js
jobs.value === {
  jobs: [ /* array of job objects */ ]
}
```

---

## root cause

* `jobData` is **not an array**
* it is an **object that contains a jobs array**
* `v-for` expects an array, not an object

Wrong assumption:

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

## solution

Point the ref directly to the array.

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

## alternative (not recommended)

```vue
<div v-for="job in jobs.jobs" :key="job.id">
```

---

## takeaways

* always `console.log` imported JSON
* `v-for` must loop over an array
* match Vue state to real data shape
* flatten data in `script setup`, not templates

---

## debug tip

```js
console.log(jobData);
console.log(Array.isArray(jobData));
```

---

# Vue Reactivity Pitfall: ref vs reactive

## problem

Mixing `ref` and `reactive` incorrectly causes:

* state not updating
* UI not rendering
* `.value` confusion

---

## root cause

Using `ref` with objects:

```js
const state = ref({
  jobs: [],
  isLoading: true,
});
```

❌ wrong:

```js
state.jobs = data;
state.isLoading.value = false;
```

✔ correct:

```js
state.value.jobs = data;
state.value.isLoading = false;
```

---

## why templates still work

Templates auto-unwrap refs:

```vue
state.jobs
state.isLoading
```

Scripts do **not**.

---

## correct usage

### ref

* primitives
* requires `.value`

```js
const count = ref(0);
count.value++;
```

### reactive (better for objects)

```js
const state = reactive({
  jobs: [],
  isLoading: true,
});

state.jobs = data;
state.isLoading = false;
```

Never use `.value` with `reactive`.

---

## final rule

> `ref` → `.value`
> `reactive` → no `.value`

Most Vue bugs here are `.value` mistakes, not Vue issues.

```
```
