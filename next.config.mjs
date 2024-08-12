export function webpack(config) {
	config.resolve.fallback = {
		fs: false, // Excluir el módulo fs en el cliente
	};
	return config;
}
