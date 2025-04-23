require(["esri/Map", "esri/views/MapView", "esri/widgets/Home", "esri/layers/GeoJSONLayer",
        "esri/widgets/Expand", "esri/widgets/BasemapGallery", "esri/widgets/LayerList",
        "esri/widgets/Fullscreen", "esri/widgets/Swipe", "esri/Graphic", "esri/geometry/geometryEngine"],
        function (Map, MapView, Home, GeoJSONLayer, Expand, BasemapGallery, LayerList,
                Fullscreen, Swipe, Graphic, geometryEngine) {
                // A boundary layer with a standard renderer and an optional popup template.
                function createBoundaryLayer(url, title, popupTemplate) {
                        return new GeoJSONLayer({
                                url: url,
                                title: title,
                                renderer: {
                                        type: "simple",
                                        symbol: {
                                                type: "simple-fill",
                                                color: [0, 0, 0, 0],
                                                outline: { color: [138, 3, 3], width: 3 }
                                        }
                                },
                                popupTemplate: popupTemplate
                        });
                }

                // A lake layer with a specified fill color. Layers are hidden by default.
                function createLakeLayer(url, title, fillColor) {
                        return new GeoJSONLayer({
                                url: url,
                                title: title,
                                visible: true,
                                renderer: {
                                        type: "simple",
                                        symbol: {
                                                type: "simple-fill",
                                                color: fillColor,
                                                outline: { color: [0, 0, 0, 0], width: 0 }
                                        }
                                }
                        });
                }

                // Map and View.
                const map = new Map({
                        basemap: "topo-vector"
                });

                const view = new MapView({
                        container: "map",
                        map: map,
                        center: [30.944220452059543, 31.181699430061567],
                        zoom: 8
                });

                // Home widget.
                view.when(function () {
                        const homeWidget = new Home({ view: view });
                        view.ui.add(homeWidget, "top-left");
                });

                // Fullscreen widget.
                const fullScreen = new Fullscreen({ view: view });
                view.ui.add(fullScreen, "top-right");

                // Basemap Gallery in an Expand widget.
                const basemapGallery = new BasemapGallery({ view: view });
                const bgExpand = new Expand({
                        view: view,
                        content: basemapGallery,
                        expandTooltip: "Basemap Gallery"
                });
                view.ui.add(bgExpand, { position: "top-right" });

                // A popup template for layers.
                const popupFieldInfos = {
                        title: "{A_NAME}",
                        content: [
                                {
                                        type: "fields",
                                        fieldInfos: [
                                                { fieldName: "OBJECTID", label: "Object ID" },
                                                { fieldName: "OBJECTID_1", label: "Object ID 1" },
                                                { fieldName: "E_NAME", label: "English Name" },
                                                { fieldName: "A_NAME", label: "Arabic Name" },
                                                { fieldName: "Code", label: "Code" },
                                                { fieldName: "Shape_Leng", label: "Shape Length (legacy)" },
                                                { fieldName: "Shape_Length", label: "Shape Length" },
                                                { fieldName: "Shape_Area", label: "Shape Area" }
                                        ]
                                }
                        ]
                };

                // Boundary Layers
                const manzala = createBoundaryLayer("GeoJSON/Manzala.json", "Manzala Boundary", popupFieldInfos);
                const burullus = createBoundaryLayer("GeoJSON/Burullus.json", "Burullus Boundary", popupFieldInfos);
                const edco = createBoundaryLayer("GeoJSON/Edco.json", "Edco Boundary", popupFieldInfos);
                map.add(manzala);
                map.add(burullus);
                map.add(edco);

                // Lake Layers
                const manzala2000 = createLakeLayer("GeoJSON/Manzala 2000.json", "Manzala 2000", [220, 52, 52]);
                const manzala2010 = createLakeLayer("GeoJSON/Manzala 2010.json", "Manzala 2010", [52, 197, 44]);
                const manzala2020 = createLakeLayer("GeoJSON/Manzala 2020.json", "Manzala 2020", [100, 149, 237]);
                map.add(manzala2000);
                map.add(manzala2010);
                map.add(manzala2020);

                const burullus2000 = createLakeLayer("GeoJSON/Burullus 2000.json", "Burullus 2000", [220, 52, 52]);
                const burullus2010 = createLakeLayer("GeoJSON/Burullus 2010.json", "Burullus 2010", [52, 197, 44]);
                const burullus2020 = createLakeLayer("GeoJSON/Burullus 2020.json", "Burullus 2020", [100, 149, 237]);
                map.add(burullus2000);
                map.add(burullus2010);
                map.add(burullus2020);

                const edco2000 = createLakeLayer("GeoJSON/Edco 2000.json", "Edco 2000", [220, 52, 52]);
                const edco2010 = createLakeLayer("GeoJSON/Edco 2010.json", "Edco 2010", [52, 197, 44]);
                const edco2020 = createLakeLayer("GeoJSON/Edco 2020.json", "Edco 2020", [100, 149, 237]);
                map.add(edco2000);
                map.add(edco2010);
                map.add(edco2020);

                // Group Layers for Management (future uses, e.g., NDWI comparisons)
                const boundaryLayers = {
                        "Manzala": manzala,
                        "Burullus": burullus,
                        "Edco": edco
                };

                const lakeLayers = {
                        "Manzala": {
                                "2000": manzala2000,
                                "2010": manzala2010,
                                "2020": manzala2020
                        },
                        "Burullus": {
                                "2000": burullus2000,
                                "2010": burullus2010,
                                "2020": burullus2020
                        },
                        "Edco": {
                                "2000": edco2000,
                                "2010": edco2010,
                                "2020": edco2020
                        }
                };

                // Table of Contents (LayerList Widget) with Toggle, Legend, and Actions
                const layerList = new LayerList({
                        view: view,
                        listItemCreatedFunction: function (event) {
                                const item = event.item;
                                // Only add a panel (legend) if the layer is not a group.
                                if (item.layer.type !== "group") {
                                        item.panel = {
                                                content: "legend",
                                                open: false
                                        };
                                }
                                // Add actions for toggling the legend panel, zooming, showing attributes, and editing style.
                                item.actionsSections = [[
                                        {
                                                title: "Zoom to layer",
                                                className: "esri-icon-zoom-out-fixed",
                                                id: "zoom-to"
                                        },
                                        {
                                                title: "Show Attributes",
                                                className: "esri-icon-description",
                                                id: "show-attributes"
                                        },
                                        {
                                                title: "Edit Style",
                                                className: "esri-icon-settings",
                                                id: "edit-style"
                                        }
                                ]];
                        }
                });
                view.ui.add(layerList, "bottom-left");

                // Listen for trigger actions on the LayerList.
                layerList.on("trigger-action", function (event) {
                        const id = event.action.id;
                        const layer = event.item.layer;

                        if (id === "zoom-to") {
                                if (layer.fullExtent) {
                                        view.goTo(layer.fullExtent).then(function () {
                                                highlightLayerBoundary(layer);
                                        }).catch(function (error) {
                                                console.error("Error zooming to layer extent:", error);
                                        });
                                } else {
                                        layer.queryExtent().then(function (response) {
                                                view.goTo(response.extent).catch(function (err) {
                                                        console.error("Error zooming via queryExtent:", err);
                                                });
                                        });
                                }

                        } else if (id === "show-attributes") {
                                // Show attributes: query the layer and display attributes from the first feature.
                                layer.when(function () {
                                        layer.queryFeatures({ where: "1=1" }).then(function (results) {
                                                let html = "";
                                                if (results.features.length > 0) {
                                                        const attributes = results.features[0].attributes;
                                                        html = `<table border="1" style="width:100%; border-collapse:collapse;">`;
                                                        for (const key in attributes) {
                                                                html += `<tr>
                                                        <td style="padding:4px;"><strong>${key}</strong></td>
                                                        <td style="padding:4px;">${attributes[key]}</td>
                                                        </tr>`;
                                                        }
                                                        html += "</table>";
                                                } else {
                                                        html = "No attributes available for " + layer.title;
                                                }
                                                view.popup.open({
                                                        title: layer.title + " Attributes",
                                                        content: html,
                                                        location: layer.fullExtent ? layer.fullExtent.center : view.center
                                                });
                                        }).catch(function (error) {
                                                console.error("Error retrieving attributes:", error);
                                        });
                                });
                        } else if (id === "edit-style") {
                                // Open a style editor for the layer.
                                openStyleEditor(layer);
                        }
                });

                // Function to open a simple style editor to update layer renderer properties.
                function openStyleEditor(layer) {
                        const styleEditorDiv = document.createElement("div");
                        styleEditorDiv.innerHTML = `
                                        <label for="fill-color">Fill Color:</label>
                                        <input type="color" id="fill-color" value="#000000"><br><br>
                                        <label for="no-fill">No Fill Color:</label>
                                        <input type="checkbox" id="no-fill"><br><br>
                                        <label for="outline-color">Outline Color:</label>
                                        <input type="color" id="outline-color" value="#8A0303"><br><br>
                                        <label for="no-outline">No Outline Color:</label>
                                        <input type="checkbox" id="no-outline"><br><br>
                                        <label for="outline-width">Outline Width:</label>
                                        <input type="number" id="outline-width" min="0" value="3" style="width:60px;"><br><br>
                                        <button id="apply-style" style="padding:4px 8px;">Apply Style</button>
                                        <button id="close-editor" style="padding:4px 8px; margin-left: 10px;">Cancel</button>
                                        `;
                        view.popup.open({
                                title: `Edit Style for ${layer.title}`,
                                content: styleEditorDiv,
                                location: layer.fullExtent ? layer.fullExtent.center : view.center
                        });

                        styleEditorDiv.querySelector("#apply-style").addEventListener("click", function () {
                                const fillColor = styleEditorDiv.querySelector("#fill-color").value;
                                const noFill = styleEditorDiv.querySelector("#no-fill").checked;
                                const outlineColor = styleEditorDiv.querySelector("#outline-color").value;
                                const noOutline = styleEditorDiv.querySelector("#no-outline").checked;
                                const outlineWidth = styleEditorDiv.querySelector("#outline-width").value;

                                // Use transparent color if the "no color" checkbox is checked.
                                const finalFillColor = noFill ? [0, 0, 0, 0] : fillColor;
                                const finalOutlineColor = noOutline ? [0, 0, 0, 0] : outlineColor;

                                // Update the renderer for the layer.
                                layer.renderer = {
                                        type: "simple",
                                        symbol: {
                                                type: "simple-fill",
                                                color: finalFillColor,
                                                outline: { color: finalOutlineColor, width: outlineWidth }
                                        }
                                };
                                view.popup.close();
                        });

                        styleEditorDiv.querySelector("#close-editor").addEventListener("click", function () {
                                view.popup.close();
                        });
                }

                // Swipe widget to compare layers.
                let swipeTool = null;

                function compareNDWI() {
                        const lakeSelect = document.getElementById("lakeSelect");
                        const yearSelectLeft = document.getElementById("yearSelectLeft");
                        const yearSelectRight = document.getElementById("yearSelectRight");

                        if (!lakeSelect || !yearSelectLeft || !yearSelectRight) {
                                console.error("Missing NDWI comparison DOM elements.");
                                return;
                        }
                        const lake = lakeSelect.value;
                        const yearLeft = yearSelectLeft.value;
                        const yearRight = yearSelectRight.value;

                        if (yearLeft === yearRight) {
                                alert("Please select two different years for comparison.");
                                return;
                        }

                        if (!lakeLayers[lake]) {
                                alert("Invalid lake selection.");
                                return;
                        }
                        Object.values(lakeLayers[lake]).forEach(layer => {
                                layer.visible = false;
                        });

                        const leftLayer = lakeLayers[lake][yearLeft];
                        const rightLayer = lakeLayers[lake][yearRight];
                        leftLayer.visible = true;
                        rightLayer.visible = true;

                        if (swipeTool) {
                                view.ui.remove(swipeTool);
                                swipeTool = null;
                        }
                        swipeTool = new Swipe({
                                view: view,
                                leadingLayers: [leftLayer],
                                trailingLayers: [rightLayer],
                                position: 50,
                                type: "vertical"
                        });
                        view.ui.add(swipeTool);

                        leftLayer.when(() => {
                                leftLayer.queryExtent().then(response => view.goTo(response.extent));
                        });
                }
                function stopComparison() {
                        if (swipeTool) {
                                view.ui.remove(swipeTool);
                                swipeTool = null;
                        }
                        const lakeSelect = document.getElementById("lakeSelect");
                        if (lakeSelect) {
                                const lake = lakeSelect.value;
                                if (lakeLayers[lake]) {
                                        Object.values(lakeLayers[lake]).forEach(layer => {
                                                layer.visible = false;
                                        });
                                }
                        }
                }
                view.when(() => {
                        const compareButton = document.getElementById("compareButton");
                        const stopButton = document.getElementById("stopButton");
                        if (compareButton) {
                                compareButton.addEventListener("click", compareNDWI);
                        }
                        if (stopButton) {
                                stopButton.addEventListener("click", stopComparison);
                        }
                });

                function highlightLayerBoundary(layer) {
                        // Query features from the layer with geometry.
                        layer.queryFeatures({
                                where: "1=1",
                                returnGeometry: true
                        }).then(function (featureSet) {
                                const features = featureSet.features;
                                if (features.length === 0) {
                                        console.warn("No features found for boundary highlight.");
                                        return;
                                }
                                // Extract all feature geometries.
                                const geometries = features.map(f => f.geometry);

                                // Union the geometries if there are multiple features.
                                let unionGeometry;
                                if (geometries.length === 1) {
                                        unionGeometry = geometries[0];
                                } else {
                                        unionGeometry = geometryEngine.union(geometries);
                                }

                                // If the unioned geometry is a polygon, convert its rings to a polyline.
                                let boundaryGeometry;
                                if (unionGeometry.type === "polygon") {
                                        boundaryGeometry = {
                                                type: "polyline",
                                                paths: unionGeometry.rings, // Use the polygon rings as the polyline paths.
                                                spatialReference: unionGeometry.spatialReference
                                        };
                                } else if (unionGeometry.type === "extent") {
                                        // If it’s an extent, we convert it to a polygon first.
                                        const polygon = unionGeometry.toPolygon();
                                        boundaryGeometry = {
                                                type: "polyline",
                                                paths: polygon.rings,
                                                spatialReference: polygon.spatialReference
                                        };
                                } else {
                                        // For any other type, fall back on the unionGeometry.
                                        boundaryGeometry = unionGeometry;
                                }

                                // Create a graphic with a dashed red line outline.
                                const graphic = new Graphic({
                                        geometry: boundaryGeometry,
                                        symbol: {
                                                type: "simple-line",
                                                color: "#05f2ee",
                                                width: 4
                                        }
                                });
                                view.graphics.add(graphic);
                                // Remove the graphic after 3 seconds.
                                setTimeout(() => {
                                        view.graphics.remove(graphic);
                                }, 3000);

                        }).catch(function (error) {
                                console.error("Error querying features for boundary highlight:", error);
                        });
                }

        });