"use client";

import { useEffect, useState } from "react";

interface Product {
	id: string;
	name: string;
	price: string;
	image: string;
	description: string;
	tipo: string;
	categoria: string;
}

export default function useProducts(
	apiUrl: string,
	category?: string,
	searchTerm?: string
) {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			console.time("fetchProducts");
			setLoading(true);

			try {
				// Verificar si los datos están en sessionStorage
				const cachedData = sessionStorage.getItem(apiUrl);
				if (cachedData) {
					setProducts(JSON.parse(cachedData));
					setLoading(false);
					console.timeEnd("fetchProducts");
					return;
				}

				// Realizar la petición
				const response = await fetch(apiUrl, {
					method: "GET",
					headers: {
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				sessionStorage.setItem(apiUrl, JSON.stringify(data)); // Guardar en caché
				setProducts(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error desconocido"
				);
			} finally {
				setLoading(false);
				console.timeEnd("fetchProducts");
			}
		};

		fetchProducts();
	}, [apiUrl]);

	useEffect(() => {
		if (!products.length) return;

		let result = products;

		if (category) {
			result = result.filter((product) => product.categoria === category);
		}

		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			result = result.filter(
				(product) =>
					product.name.toLowerCase().includes(term) ||
					product.description.toLowerCase().includes(term) ||
					product.tipo.toLowerCase().includes(term)
			);
		}

		setFilteredProducts(result);
	}, [products, category, searchTerm]);

	return {
		products: filteredProducts.length > 0 ? filteredProducts : products,
		loading,
		error,
	};
}
