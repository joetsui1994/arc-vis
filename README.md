# Arc-Vis

A visualisation tool for visualising hierarchical data with the following unique features:
* wrapped in a React functional component
* customizable settings for optimal visualisation
* an arc containing objects that are not categorised in any downstream arcs are accommodated using artifical arcs called `other`
* each arc can be further divided into `divs` which are not selectable

## Data Format

The following nested data structure is required as input:

```json
{
	"name": "root",
	"num": 52,
	"height": 3,
	"children": [
		{
			"name": "A",
			"num": 25,
			"children": [
				{
					"name": "A.1",
					"value": 15,
					"num": 15,
					"children": [],
					"divs": [
						{ "name": "cat-A", "num": 10 },
						{ "name": "cat-B", "num": 5 }
					]
				},
				{
					"name": "A.2",
					"value": 8,
					"num": 8,
					"children": [],
					"divs": [
						{ "name": "cat-A", "num": 8 }
					]
				},
				{
					"name": "other",
					"value": 2,
					"num": 2,
					"children": [],
					"divs": []
				}
			],
			"divs": [
				{ "name": "cat-A", "num": 18 },
				{ "name": "cat-B", "num": 7 }
			]
		},
		{
			"name": "B",
			"num": 22,
			"children": [
				{
					"name": "B.1",
					"num": 18,
					"children": [
						{
							"name": "B.1.1",
							"value": 10,
							"num": 10,
							"children": [],
							"divs": [
								{ "name": "cat-A", "num": 2 },
								{ "name": "cat-C", "num": 8 }
							]
						},
						{
							"name": "B.1.2",
							"value": 8,
							"num": 8,
							"children": [],
							"divs": [
								{ "name": "cat-A", "num": 5 },
								{ "name": "cat-B", "num": 3 }
							]
						}
					],
					"divs": [
						{ "name": "cat-B", "num": 10 },
						{ "name": "cat-C", "num": 8 }
					]
				},
				{
					"name": "other",
					"value": 4,
					"num": 4,
					"children": [],
					"divs": []
				}
			]
		},
		{
			"name": "other",
			"num": 5,
			"value": 5,
			"children": [],
			"divs": []
		}
	]
}					
```
