(function (yourCode) {
      yourCode(window.jQuery, window, document)
}(function ($, window) {
      let matriz = {}
      let matrizAux = []
      $(function () {
            $("#aumentar-fila").on('click', addRow)
            $("#aumentar-col").on('click', addColumn)
            $("#eliminar-fila").on('click', deleteRow)
            $("#eliminar-col").on('click', deleteColumn)
            $("#maximin").on('click', maximin)
            $("#maximax").on('click', maximax)
            $("#regret").on('click', regret)
            $("#hardwiz").on('click', hardwiz)
            $("#emv").on('click', emv)
            $("#eol").on('click', eol)
            $("#sensibility").on('click', sensibiltyAnalisis)
            $("#metodos").on("change", vistasMetodos)
      })
      function addRow() {
            let filas = '<tr><td scope="row">  <input class="form-control form-control-sm" type="text" value="Alt"> </td><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td></tr>'
            $("#tabledata").append(filas)
      }

      function addColumn() {
            var table = document.getElementById('tabledata');
            var colCount = table.rows[0].cells.length;
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                  var row = table.rows[i];
                  var col = row.insertCell(colCount);
                  if (i == 0) {
                        col.innerHTML = '<th><b>Evento</b></th>';
                  } else {
                        col.innerHTML = '<td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td>';
                  }
            }
            var table = document.getElementById('probability');
            var colCount = table.rows[0].cells.length;
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                  var row = table.rows[i];
                  var col = row.insertCell(colCount);
                  if (i == 0) {
                        col.innerHTML = '<th><b>Evento</b></th>';
                  } else {
                        col.innerHTML = '<td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td>';
                  }
            }
      }

      function deleteColumn() {
            var table = document.getElementById('tabledata');
            var colCount = table.rows[0].cells.length;
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                  var row = table.rows[i];
                  row.deleteCell(colCount - 1);
            }
            var table = document.getElementById('probability');
            var colCount = table.rows[0].cells.length;
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                  var row = table.rows[i];
                  row.deleteCell(colCount - 1);
            }
      }

      function deleteRow() {
            var table = document.getElementById("tabledata");
            var rowCount = table.rows.length;
            //console.log(rowCount);

            if (rowCount <= 1)
                  alert('No se puede eliminar el encabezado');
            else
                  table.deleteRow(rowCount - 1);
      }


      function armarMatriz() {
            matrizAux = []
            $("#tabledata tbody tr").each(function () {
                  let matrizVal = []
                  $(this).find('td').each(function () {
                        matrizVal.push($(this).find('input').val())
                  })
                  matrizAux.push(matrizVal);
            })

            matriz.Matriz = matrizAux
      }

      function maximin() {
            armarMatriz()
            console.log(JSON.stringify(matriz));

            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetWaldCriterion",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        console.log(datos)
                  },
            })
      }

      function maximax() {
            armarMatriz()
            console.log(JSON.stringify(matriz));

            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetMaximaxCriterion",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        console.log(datos)
                  },
            })
      }

      function regret() {
            armarMatriz()
            console.log(matriz);

            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetSavageCriterion",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        console.log(datos)
                  },
            })
      }

      function hardwiz() {
            armarMatriz()
            matriz.Alfa = $("#alfaVal").val()
            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetHurwiczCriterion",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        console.log(datos)
                  },
            })
      }

      function vistasMetodos() {
            let opciones = parseInt($(this).val())
            switch (opciones) {
                  case 1:
                        $("#no-probablistic").attr('hidden', true)
                        $("#probablistic").removeAttr('hidden')
                        $("#alfa").attr('hidden', true)
                        $("#probability").removeAttr('hidden')
                        break
                  case 2:
                        $("#probablistic").attr('hidden', true)
                        $("#no-probablistic").removeAttr('hidden')
                        $("#alfa").removeAttr('hidden')
                        $("#probability").attr('hidden', true)
                        break
                  default:
                        break
            }
      }

      function emv() {
            armarMatriz()
            armarProbabilidades()
            console.log(JSON.stringify(matriz));
            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetMatrizEMV",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        tableProbabilisticResults(datos)
                  },
            })
      }

      function armarProbabilidades() {
            let matrizVal = []
            $("#probability tbody tr td").each(function () {
                  matrizVal.push($(this).find('input').val())
            })
            matrizVal.shift()
            matriz.Probability = matrizVal
      }

      function tableProbabilisticResults(datos) {
            let encabezado = document.createElement('thead')
            let cuerpoTabla = document.createElement('tbody')
            let titulos = document.createElement('tr')
            for (let index = 0; index < datos.Matriz[0]; index++) {
                  if (dato == "null") {
                        dato = "Alternativas"
                  }
                  let titulo = document.createElement('th')
                  titulos.appendChild(document.createTextNode(dato));
                  titulo.appendChild(celda)
                  encabezado.appendChild(titulo)
            }

            datos.Matriz.forEach(function (datosFilas) {
                  let fila = document.createElement('tr')
                  datosFilas.forEach(function (datosCeldas) {
                        let celda = document.createElement('td')
                        celda.appendChild(document.createTextNode(datosCeldas))
                        fila.appendChild(celda)
                  });

                  cuerpoTabla.appendChild(fila)
            });

            $("#results").html(encabezado)
            $("#results").html(cuerpoTabla)
            $("#resultados").html($("#results"))
      }

      function eol() {
            armarMatriz()
            armarProbabilidades()
            console.log(JSON.stringify(matriz));
            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetMatrizEOL",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        tableProbabilisticResults(datos)
                  },
            })
      }

      function sensibiltyAnalisis() {
            armarMatriz()
            armarProbabilidades()
            console.log(JSON.stringify(matriz));
            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetSensitivityAnalysis",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        armarGrafico(datos)
                  },
            })
      }

      function armarGrafico(datos) {
            let alternativas = []
            let columnas = datos.Matriz.length - 1
            for (let i = 1; i <= columnas; i++) {
                  let objetosAlternativas = {}
                  objetosAlternativas.x = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
                  objetosAlternativas.y = datos.Matriz[i].splice(1, 12)
                  objetosAlternativas.mode = 'lines+markers'
                  objetosAlternativas.type = 'scatter'
                  objetosAlternativas.name = datos.Matriz[i][0]
                  alternativas.push(objetosAlternativas)
            }
            var data = alternativas
            Plotly.newPlot('grafico', data);

      }
}))
