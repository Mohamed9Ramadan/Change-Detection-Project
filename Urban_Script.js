require([
        "esri/Map", "esri/views/MapView", "esri/widgets/Home", "esri/layers/GeoJSONLayer",
        "esri/widgets/Expand", "esri/widgets/BasemapGallery", "esri/widgets/LayerList",
        "esri/widgets/Fullscreen", "esri/widgets/Swipe", "esri/Graphic",
        "esri/geometry/geometryEngine"
], function (
        Map, MapView, Home, GeoJSONLayer, Expand, BasemapGallery, LayerList, Fullscreen, Swipe,
        Graphic, geometryEngine
) {
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

        // Revised createNDBILayer: added fillColor as a parameter and fixed the typo "width".
        function createNDBILayer(url, title, fillColor) {
                return new GeoJSONLayer({
                        url: url,
                        title: title,
                        visible: false,
                        renderer: {
                                type: "simple",
                                symbol: {
                                        type: "simple-fill",
                                        color: fillColor || [150, 150, 150, 0.5], // Default fill color
                                        outline: { color: [0, 0, 0, 0], width: 0 } // Default outline
                                }
                        }
                });
        }

        // Map and View.
        const map = new Map({
                basemap: "topo-vector"
        });

        const view = new MapView({
                container: "map4",
                map: map,
                center: [30.973015467367418, 31.141660768687828],
                zoom: 7
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

        // Popup template for layers.
        const popupFieldInfos = {
                title: "{A_NAME}",
                content: [
                        {
                                type: "fields",
                                fieldInfos: [
                                        { fieldName: "OBJECTID", label: "Object ID" },
                                        { fieldName: "E_NAME", label: "English Name" },
                                        { fieldName: "A_NAME", label: "Arabic Name" }
                                ]
                        }
                ]
        };

        // Boundary Layers.
        const portsaid = createBoundaryLayer("GeoJSON2/Port Said.json", "Port Said Boundary", popupFieldInfos);
        const damietta = createBoundaryLayer("GeoJSON2/Damietta.json", "Damietta Boundary", popupFieldInfos);
        const dakahlia = createBoundaryLayer("GeoJSON2/Al Dakahlia.json", "Dakahlia Boundary", popupFieldInfos);
        const sharqia = createBoundaryLayer("GeoJSON2/Al Sharkia.json", "Sharqia Boundary", popupFieldInfos);
        const ismailia = createBoundaryLayer("GeoJSON2/Ismailia.json", "Ismailia Boundary", popupFieldInfos);
        const gharbia = createBoundaryLayer("GeoJSON2/Al Gharbia.json", "Gharbia Boundary", popupFieldInfos);
        const kafralshiekh = createBoundaryLayer("GeoJSON2/Kafr Al Sheikh.json", "Kafr Al Sheikh Boundary", popupFieldInfos);
        const behira = createBoundaryLayer("GeoJSON2/Al Bahaira.json", "Behira Boundary", popupFieldInfos);
        const menofia = createBoundaryLayer("GeoJSON2/Al Menofia.json", "Menofia Boundary", popupFieldInfos);
        const qalubia = createBoundaryLayer("GeoJSON2/Al Qalubia.json", "Qalubia Boundary", popupFieldInfos);
        const alexandria = createBoundaryLayer("GeoJSON2/Alexandria.json", "Alexandria Boundary", popupFieldInfos);

        map.addMany([
                portsaid, damietta, dakahlia, sharqia, ismailia, gharbia,
                kafralshiekh, behira, menofia, qalubia, alexandria
        ]);

        // NDBI Layers
        const porttsaid2000 = createNDBILayer("GeoJSON3/portsaid2000.json", "Port Said NDBI 2000", [220, 52, 52]);
        const porttsaid2010 = createNDBILayer("GeoJSON3/portsaid2010.json", "Port Said NDBI 2010", [52, 197, 44]);
        const porttsaid2020 = createNDBILayer("GeoJSON3/PortSaid2020.json", "Port Said NDBI 2020", [100, 149, 237]);
        const damietta2000 = createNDBILayer("GeoJSON3/damiatta2000.json", "Damietta NDBI 2000", [220, 52, 52]);
        const damietta2010 = createNDBILayer("GeoJSON3/Domiate2010.json", "Damietta NDBI 2010", [52, 197, 44]);
        const damietta2020 = createNDBILayer("GeoJSON3/Damietta2020.json", "Damietta NDBI 2020", [100, 149, 237]);
        const dakahlia2000 = createNDBILayer("GeoJSON3/dakahlia2000.json", "Dakahlia NDBI 2000", [220, 52, 52]);
        const dakahlia2010 = createNDBILayer("GeoJSON3/Eldakhlia2010.json", "Dakahlia NDBI 2010", [52, 197, 44]);
        const dakahlia2020 = createNDBILayer("GeoJSON3/Dakahlia2020.json", "Dakahlia NDBI 2020", [100, 149, 237]);
        const sharqia2000 = createNDBILayer("GeoJSON3/sharqia2000.geojson", "Sharqia NDBI 2000", [220, 52, 52]);
        const sharqia2010 = createNDBILayer("GeoJSON3/Elsharkia2010.json", "Sharqia NDBI 2010", [52, 197, 44]);
        const sharqia2020 = createNDBILayer("GeoJSON3/Sharqia2020.json", "Sharqia NDBI 2020", [100, 149, 237]);
        const ismaila2000 = createNDBILayer("GeoJSON3/ismailia2000.json", "Ismailia NDBI 2000", [200, 52, 52]);
        const ismaila2010 = createNDBILayer("GeoJSON3/Elismalia2010.json", "Ismailia NDBI 2010", [52, 197, 44]);
        const ismaila2020 = createNDBILayer("GeoJSON3/Ismailia2020.json", "Ismailia NDBI 2020", [100, 149, 237]);
        const gharbia2000 = createNDBILayer("GeoJSON3/gharbia2000.json", "Gharbia NDBI 2000", [220, 52, 52]);
        const gharbia2010 = createNDBILayer("GeoJSON3/Elghrbia2010.json", "Gharbia NDBI 2010", [52, 197, 44]);
        const gharbia2020 = createNDBILayer("GeoJSON3/Gharbia2020.json", "Gharbia NDBI 2020", [100, 149, 237]);
        const kafralsheikh2000 = createNDBILayer("GeoJSON3/kafr_elseikh2000.json", "Kafr Al Sheikh NDBI 2000", [220, 52, 52]);
        const kafralsheikh2010 = createNDBILayer("GeoJSON3/kafrelsheikh2010.json", "Kafr Al Sheikh NDBI 2010", [52, 197, 44]);
        const kafralsheikh2020 = createNDBILayer("GeoJSON3/KafrAlsheikh2020.json", "Kafr Al Sheikh NDBI 2020", [100, 149, 237]);
        const behira2000 = createNDBILayer("GeoJSON3/behaira2000.json", "Behira NDBI 2000", [220, 52, 52]);
        const behira2010 = createNDBILayer("GeoJSON3/Elbouhyra2010.json", "Behira NDBI 2010", [52, 197, 44]);
        const behira2020 = createNDBILayer("GeoJSON3/Behira2020.json", "Behira NDBI 2020", [100, 149, 237]);
        const menofia2000 = createNDBILayer("GeoJSON3/meofia2000.json", "Menofia NDBI 2000", [220, 52, 52]);
        const menofia2010 = createNDBILayer("GeoJSON3/Elmonofia2010.json", "Menofia NDBI 2010", [52, 197, 44]);
        const menofia2020 = createNDBILayer("GeoJSON3/Menofia2020.json", "Menofia NDBI 2020", [100, 149, 237]);
        const qalubia2000 = createNDBILayer("GeoJSON3/qalubia2000.json", "Qalubia NDBI 2000", [220, 52, 52]);
        const qalubia2010 = createNDBILayer("GeoJSON3/Elkalubia2010.json", "Qalubia NDBI 2010", [52, 197, 44]);
        const qalubia2020 = createNDBILayer("GeoJSON3/Qalubia2020.json", "Qalubia NDBI 2020", [100, 149, 237]);
        const alexandria2000 = createNDBILayer("GeoJSON3/alexandria2000.json", "Alexandria NDBI 2000", [220, 52, 52]);
        const alexandria2010 = createNDBILayer("GeoJSON3/Alexandria2010.json", "Alexandria NDBI 2010", [52, 197, 44]);
        const alexandria2020 = createNDBILayer("GeoJSON3/Alexandria2020.geojson", "Alexandria NDBI 2020", [100, 149, 237]);

        map.addMany([
                porttsaid2000, porttsaid2010, porttsaid2020,
                damietta2000, damietta2010, damietta2020,
                dakahlia2000, dakahlia2010, dakahlia2020,
                sharqia2000, sharqia2010, sharqia2020,
                ismaila2000, ismaila2010, ismaila2020,
                gharbia2000, gharbia2010, gharbia2020,
                kafralsheikh2000, kafralsheikh2010, kafralsheikh2020,
                behira2000, behira2010, behira2020,
                menofia2000, menofia2010, menofia2020,
                qalubia2000, qalubia2010, qalubia2020,
                alexandria2000, alexandria2010, alexandria2020
        ]);

        // Group Layers for Management (future uses, e.g., NDWI comparisons)
        const boundaryLayers = {
                "Port Said": portsaid,
                "Damietta": damietta,
                "Dakahlia": dakahlia,
                "Sharqia": sharqia,
                "Ismailia": ismailia,
                "Gharbia": gharbia,
                "Kafr Al Sheikh": kafralshiekh,
                "Behira": behira,
                "Menofia": menofia,
                "Qalubia": qalubia,
                "Alexandria": alexandria
        };

        const ndbiLayer = {
                "Port Said": {
                        "2000": porttsaid2000,
                        "2010": porttsaid2010,
                        "2020": porttsaid2020
                },
                "Damietta": {
                        "2000": damietta2000,
                        "2010": damietta2010,
                        "2020": damietta2020
                },
                "Dakahlia": {
                        "2000": dakahlia2000,
                        "2010": dakahlia2010,
                        "2020": dakahlia2020
                },
                "Sharqia": {
                        "2000": sharqia2000,
                        "2010": sharqia2010,
                        "2020": sharqia2020
                },
                "Ismailia": {
                        "2000": ismaila2000,
                        "2010": ismaila2010,
                        "2020": ismaila2020
                },
                "Gharbia": {
                        "2000": gharbia2000,
                        "2010": gharbia2010,
                        "2020": gharbia2020
                },
                "Kafr Al Sheikh": {
                        "2000": kafralsheikh2000,
                        "2010": kafralsheikh2010,
                        "2020": kafralsheikh2020
                },
                "Behira": {
                        "2000": behira2000,
                        "2010": behira2010,
                        "2020": behira2020
                },
                "Menofia": {
                        "2000": menofia2000,
                        "2010": menofia2010,
                        "2020": menofia2020
                },
                "Qalubia": {
                        "2000": qalubia2000,
                        "2010": qalubia2010,
                        "2020": qalubia2020
                },
                "Alexandria": {
                        "2000": alexandria2000,
                        "2010": alexandria2010,
                        "2020": alexandria2020
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

        function compareNDBI() {
                const governorateSelect = document.getElementById("governorateSelect");
                const yearSelectLeft = document.getElementById("yearSelectLeft");
                const yearSelectRight = document.getElementById("yearSelectRight");

                if (!governorateSelect || !yearSelectLeft || !yearSelectRight) {
                        console.error("Missing NDBI comparison DOM elements.");
                        return;
                }

                const governorate = governorateSelect.value;
                const yearLeft = yearSelectLeft.value;
                const yearRight = yearSelectRight.value;

                if (yearLeft === yearRight) {
                        alert("Please select two different years for comparison.");
                        return;
                }

                if (!ndbiLayer[governorate]) {
                        alert("Invalid governorate selection.");
                        return;
                }
                Object.values(ndbiLayer[governorate]).forEach(layer => {
                        layer.visible = false;
                });

                const leftLayer = ndbiLayer[governorate][yearLeft];
                const rightLayer = ndbiLayer[governorate][yearRight];
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
                const governorateSelect = document.getElementById("governorateSelect");
                if (governorateSelect) {
                        const governorate = governorateSelect.value;
                        if (ndbiLayer[governorate]) {
                                Object.values(ndbiLayer[governorate]).forEach(layer => {
                                        layer.visible = false;
                                });
                        }
                }
        }
        view.when(() => {
                const compareButton = document.getElementById("compareButton");
                const stopButton = document.getElementById("stopButton");
                if (compareButton) {
                        compareButton.addEventListener("click", compareNDBI);
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