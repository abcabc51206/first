            OpenLayers.DOTS_PER_INCH = 96;
            
			var gaussPyramid = new Geo.Pyramid({
				name: "nj92new",
				pyramidID:"3abda1d1-846c-4091-9648-ecfa879c4ee6",
				description: "高斯3度金字塔",
				topLevelIndex: 0,
				bottomLevelIndex: 20,
				scaleX: 2,
				scaleY: 2,
				tileSize: new Geo.Size(256,256),
				originRowIndex: 0,
				originColIndex: 0,
				topTileFromX: 80000,
				topTileFromY: 250000.0,
				topTileToX: 5.128E7,
				topTileToY: -5.095E7,
				maxExtent: new Geo.Bounds(80000.0,50000.0,180000.0,220000.0)
			});
            
            var gaussUints = "m";
            
            var gaussProjection = "EPSG:2361";
            
            //分辨率
            var resolutionArr=[195.3125,97.65625,48.828125,24.4140625,12.20703125,6.103515625,3.0517578125,1.52587890625,0.762939453125,0.3814697265625,
                                       0.19073486328125,0.095367431640625,0.0476837158203125,0.02384185791015625,0.011920928955078125,0.0059604644775390625,
                                       0.0029802322387695312,0.0014901161193847656,0.0007450580596923828,0.0003725290298461914,0.0001862645149230957]