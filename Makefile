build:
	node index.js
	pandoc -o output/ambient-product-design.epub metadata.yaml output/ambient-product-design.md
