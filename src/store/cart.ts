import {
  // computed,
  observable,
} from 'mobx'

export interface Product {
  id: number;
  name: string;
  price: number;
  count: number;
}

export const cart = observable({
  products: observable.map(),

  addProduct (product: Product) {
    if (this.product.has(product.id)) {
      throw new Error('Product already exists')
    } else {
      this.product.set(product.id, Product)
    }
  },

  updateProduct (product: Product) {
    this.product.set(product.id, product)
  },

  removeProduct (id: any) {
    this.product.delete(id)
  },

  // unenrollProduct(courseId: number, ProductId: number) {
  //     this.enrollment.get(courseId).remove(ProductId)
  // },

  // enrolledProducts(courseId: number) {
  //     return computed(() => this.enrollment.get(courseId).map((n: any) => this.product.get(n))).get()
  // },
})
