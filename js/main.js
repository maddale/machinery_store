
var merch = JSON.parse(data).data.products;

var vm = new Vue({
  el: "#vm",
  data: {
    items: merch,
    filter: false,
    modalVisible: false,
    currentItem: "",
    order: {},
    cart: [],
    modalMode: "",
    lastScroll: 0
  },
  computed: {
    getUniqCats: function() {
      var store = [];
      var uniq_cats = [];
      this.items.map(function(item) { store.push(item.machine_categories.map(function(cat){ return cat.name }))});
      store = store.flat(1);
      store.forEach(function(el){
        if (uniq_cats.indexOf(el) == -1) {
          uniq_cats.push(el)
        }
      });
      return uniq_cats
    },
    getFilteredItems: function() {
      return this.filter ? this.items.filter(item => item.machine_categories.map(function(ctg) { return ctg.name }).indexOf(this.filter) > -1 ) : this.items
    },
    cartCounter: function() {
      return this.cart.reduce(function(sum, cur) { return sum + cur.count }, 0)
    },
    totalPrice: function() {
      return this.cart.reduce(function(sum, cur) { return sum + (cur.count * cur.price) }, 0)
    }
  },
  watch: {
    modalVisible: function() {
        this.restoreScroll()
    }
  },
  methods: {
    openItem: function(item) {
      this.lastScroll = document.documentElement.scrollTop;
      this.modalMode    = "item";
      this.currentItem  = item;
      this.modalVisible = true
    },
    openCart: function() {
      this.modalMode    = "order";
      this.modalVisible = true
    },
    dec: function (id) {
      var item = this.findInCartById(id);
      if (item.count > 1) {
        item.count -= 1
      }
    },
    getNames: function(obj) {
      return obj.map(function(el) { return el.name }).join(", ")
    },
    getItemById: function(id) {
      return this.items.filter(function(item) { return item.id == id })[0]
    },
    addToCart: function(item) {
      var cartItem = this.findInCartById(item.id)

      if (cartItem) {
        cartItem.count += 1
      } else {
        cartItem = {
          id: item.id,
          image: item.thumbnail.thumbnail_url,
          name: item.name,
          price: item.price,
          count: 1,
        };
        this.cart.push(cartItem)
      }
    },
    clearCart: function() {
      if (confirm("Are you sure to remove all the items from your cart?")) {
        while (this.cart.length > 0) {
          this.cart.pop()
        }
      }
    },
    findInCartById: function(id) {
      return this.cart.filter(function(item) { return item.id == id })[0]
    },
    removeById: function(id) {
      this.cart.forEach((el, i) => {
        if (el.id == id) {
          this.cart.splice(i, 1)
        }
      })
    },
    findItemCount: function(id) {
      return this.findInCartById(id).count
    },
    isAdded: function(id) {
      var item = this.findInCartById(id);
      if (item) {
        return true
      }
    },
    restoreScroll: function() {
      document.documentElement.scrollTop = this.lastScroll
    }
  }
});


