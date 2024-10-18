{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable-small";
		flake-utils.url = "github:numtide/flake-utils";
	};

	outputs = { self, nixpkgs, flake-utils }:
		flake-utils.lib.eachDefaultSystem (system:
			let pkgs = import nixpkgs { inherit system; config = { allowUnfree = true; }; };
			in {
				devShells.default = pkgs.mkShell {
					buildInputs = with pkgs; [
						nodejs_20
						nodePackages.prisma
						python3
						poetry
						
						gcc
						gnused

						yt-dlp
						ffmpeg
						openssl

						google-chrome
						postgresql_16
					];
					
					shellHook = ''
						export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
						export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
						export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
						export PUPPETEER_EXECUTABLE_PATH="${pkgs.google-chrome}/bin/google-chrome-stable"
						export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
						export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

						docker compose up -d db
    				'';
				};
			}
		);
}
