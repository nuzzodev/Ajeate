<template>
  <div class="card shadow-sm">
    <div class="card-header bg-white d-flex justify-content-between align-items-center">
      <h5 class="mb-0">{{ title }}</h5>
      <button class="btn btn-primary" @click="$emit('create')">
        <i class="bi bi-plus-circle me-2"></i>Nuevo
      </button>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key">
                {{ column.label }}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item[primaryKey]">
              <td v-for="column in columns" :key="column.key">
                {{ getNestedValue(item, column.key) }}
              </td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" @click="$emit('edit', item)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', item)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    title: String,
    columns: Array,
    data: Array,
    primaryKey: {
      type: String,
      default: 'id'
    }
  },
  methods: {
    getNestedValue(obj, path) {
      return path.split('.').reduce((o, p) => (o ? o[p] : '-'), obj);
    }
  }
}
</script>