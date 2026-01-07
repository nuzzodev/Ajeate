<template>
  <div class="card shadow-sm m-3 border-0 rounded-4 overflow-hidden">
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th v-for="column in columns" :key="column.key" :class="column.class" class="py-3 px-4">
                {{ column.label }}
              </th>
              <th class="text-center py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item[primaryKey]">
              <td v-for="column in columns" :key="column.key" :class="column.class" class="px-4">
                <template v-if="column.format">
                  {{ column.format(item) }}
                </template>
                <template v-else>
                  {{ getNestedValue(item, column.key) }}
                </template>
              </td>
              
              <td class="px-4">
                <div class="d-flex justify-content-center gap-2">
                  <button v-if="showDetail" 
                    class="btn btn-sm btn-outline-info rounded-pill px-3" 
                    @click="$emit('view', item)">
                    <i class="bi bi-eye me-1"></i> Ver
                  </button>

                  <button v-if="showEdit" 
                    class="btn btn-sm btn-outline-dark rounded-pill px-3" 
                    @click="$emit('edit', item)">
                    <i class="bi bi-pencil me-1"></i> Editar
                  </button>

                  <button v-if="showDelete" 
                    class="btn btn-sm btn-outline-danger rounded-circle" 
                    @click="$emit('delete', item)">
                    <i class="bi bi-trash"></i>
                  </button>
                  <button v-if="showPrepare" 
                    class="btn btn-sm btn-warning rounded-pill px-3 fw-bold shadow-sm" 
                    @click="$emit('prepare', item)">
                    <i class="bi bi-hammer me-1"></i> Preparar
                  </button>
                </div>
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
    columns: Array,
    data: Array,
    primaryKey: { type: String, default: 'id' },
    // Control de visibilidad de botones
    showEdit: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },
    showDetail: { type: Boolean, default: false }, // Desactivado por defecto
    showPrepare: { type: Boolean, default: false }
  },
  methods: {
    getNestedValue(obj, path) {
      if (!path) return '';
      return path.split('.').reduce((o, p) => (o ? o[p] : '-'), obj);
    }
  }
}
</script>