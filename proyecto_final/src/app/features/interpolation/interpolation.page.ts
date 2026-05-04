import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-interpolation-page',
  templateUrl: './interpolation.page.html',
})
export class InterpolationPage {
  /*
   * Objetivo del ejercicio:
   * Practicar interpolacion de strings y propiedades calculadas.
   *
   * Que debe completar el estudiante:
   * Actividad 1, nivel basico:
   * - Mostrar mas propiedades del objeto product.
   *
   * Actividad 2, nivel intermedio:
   * - Crear una propiedad calculada para mostrar el precio con IVA.
   *
   * Actividad 3, nivel reto:
   * - Crear un texto de disponibilidad segun el stock.
   *
   * Criterio de aceptacion:
   * - No escribir valores fijos en el HTML.
   * - Todo debe salir desde propiedades del componente.
   */

  //Desarrollo actividad 2.
  // Nota: ya se encuentra resuelta, solo se actualizan datos

  readonly student = signal({
    firstName: 'Ivo',
    lastName: 'Astudillo',
    email: 'ivo_astudillo@outlook.com',
    active: true,
  });

  readonly product = signal({
    name: 'Laptop educativa',
    price: 750,
    stock: 12,
    category: 'Tecnologia',
  });

  readonly taxRate = signal(0.15);

  readonly studentFullName = computed(() => {
    const student = this.student();
    return `${student.firstName} ${student.lastName}`;
  });

  readonly studentStatus = computed(() => (this.student().active ? 'Activo' : 'Inactivo'));

  readonly priceWithTax = computed(() => this.product().price * (1 + this.taxRate()));

  readonly availabilityText = computed(() => {
    const stock = this.product().stock;

    if (stock === 0) {
      return 'Agotado';
    }

    if (stock <= 5) {
      return 'Ultimas unidades';
    }

    return 'Disponible';
  });

  toggleStudentStatus(): void {
    this.student.update((student) => ({
      ...student,
      active: !student.active,
    }));
  }

  updateTaxRate(value: string): void {
    const numericValue = Number(value);

    this.taxRate.set(Number.isNaN(numericValue) ? 0 : numericValue / 100);
  }

  addStock(): void {
    this.product.update((product) => ({
      ...product,
      stock: product.stock + 1,
    }));
  }
}
