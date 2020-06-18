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
            let filas = '<tr><td scope="row">  <input class="form-control form-control-sm" type="text" value="Alternativa X"> </td><td>  <input class="form-control form-control-sm" type="number" placeholder="Ingrese el valor"> </td><td>  <input class="form-control form-control-sm" type="number" placeholder="Ingrese el valor"> </td></tr>'
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
                  } else if(i == 1) {
                        col.innerHTML = '<td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el nombre" value="Estado X"> </td>';
                  }else{
                        col.innerHTML = '<td>  <input class="form-control form-control-sm" type="number" placeholder="Ingrese el valor"> </td>';   
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

            if (rowCount <= 2)
                  alert('No se puede eliminar los encabezados');
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
            armarMatriz();
            //console.log(JSON.stringify(matriz));

            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetWaldCriterion",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        console.log(datos);
                        tableResult(datos);
                  },
                  error: function(err){
                        console.log(err);
                        alert("Ocurrio un error");
                  }
            })
      }

      function maximax() {
            armarMatriz()
            //console.log(JSON.stringify(matriz));

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
                        tableResult(datos)
                  },
                  error: function(err){
                        console.log(err);
                        alert("Ocurrio un error");
                  }
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
                        tableResult(datos)      
                  },
                  error: function(err){
                        console.log(err);
                        alert("Ocurrio un error");
                  }
            })
      }

      function hardwiz() {
            armarMatriz()
            matriz.Alfa = $("#alfaVal").val()
            if(matriz.Alfa == ""){
                  alert("Debe indicar el valor de alfa para continuar");
                  return;
            }
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
                        tableResult(datos)
                  },
                  error: function(err){
                        console.log(err);
                        alert("Ocurrio un error");
                  }
            })
      }

      function vistasMetodos() {
            let opciones = parseInt($(this).val())
            let div = '';
            switch (opciones) {
                  case 1:
                        $("#no-probablistic").attr('hidden', true)
                        $("#probablistic").removeAttr('hidden')
                        $("#alfa").attr('hidden', true)
                        $("#probability").removeAttr('hidden')
                        div = 'probablistic';
                        break
                  case 2:
                        $("#probablistic").attr('hidden', true)
                        $("#no-probablistic").removeAttr('hidden')
                        $("#alfa").removeAttr('hidden')
                        $("#probability").attr('hidden', true)
                        div = 'no-probablistic';
                        break
                  default:
                        break
            }
            $('html, body').animate({
                  scrollTop: $('#'+div+'').offset().top
            }, 2000);
      }

      function tableResult(datos){
            let encabezado = document.createElement('thead')
            let cuerpoTabla = document.createElement('tbody')
            let titulos = document.createElement('tr')
            var alt = datos.Descripcion.split(";");
            alt.pop();
            console.log(alt);
      
            alt.forEach(function (datosFilas) {
                  let fila = document.createElement('tr')
                  var info = datosFilas.split(":");
                  console.log("info" + info);
                  
                  let celda = document.createElement('td')          
                  celda.appendChild(document.createTextNode(info[0]))
                  fila.appendChild(celda)

                  celda = document.createElement('td')          
                  celda.appendChild(document.createTextNode("Estado: " + info[1].split("=")[2]))
                  fila.appendChild(celda)

                  celda = document.createElement('td')          
                  celda.appendChild(document.createTextNode("Valor: $" + new Intl.NumberFormat().format(info[1].split("=")[1].split(" ")[0])))
                  fila.appendChild(celda)
                  
                  cuerpoTabla.appendChild(fila)
            });

            let fila = document.createElement('tr')
            let celda = document.createElement('td')
            celda.setAttribute('colspan','3')
            celda.setAttribute('style','text-align:center; background-color:#1cc88a;color:white')
            celda.appendChild(document.createTextNode("Elección Sugerida por Criterio " + datos.Criterio))
            fila.appendChild(celda)
            cuerpoTabla.appendChild(fila)


            fila = document.createElement('tr')
            celda = document.createElement('td')
            celda.setAttribute('colspan','3')
            celda.setAttribute('style','text-align:center;')
            celda.appendChild(document.createTextNode(datos.Resultado))
            fila.appendChild(celda)
            cuerpoTabla.appendChild(fila)
            

            $("#results").html(encabezado)
            $("#results").html(cuerpoTabla)
            $("#resultados").html($("#results"))
            $('html, body').animate({
                  scrollTop: $("#resultados").offset().top
            }, 2000);
      }

      function emv() {
            if(!validarProbabilidades()){
                  return;
            }
            
            armarMatriz()
            armarProbabilidades()
            
            //console.log(JSON.stringify(matriz));
            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetMatrizEMV",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                         $("#solucion").text(datos.Result)
                        tableProbabilisticResults(datos)
                  },
                  error: function(err){
                        console.log(err);
                        alert("Ocurrio un error");
                  }
            })

            $('html, body').animate({
                  scrollTop: $('#resultados').offset().top
            }, 2000);
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
            console.log("Matriz: "+ datos.Matriz[0]);
            
            for (let index = 0; index < datos.Matriz[0]; index++) {
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
            $('html, body').animate({
                  scrollTop: $("#resultados").offset().top
            }, 2000);
      }

      function eol() {
            if(!validarProbabilidades()){
                  return;
            }
            armarMatriz()
            armarProbabilidades()
            ////console.log(JSON.stringify(matriz));
            $.ajax({
                  headers: {
                        "Content-Type": "application/json"
                  },
                  type: "POST",
                  dataType: "json",
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetMatrizEOL",
                  data: JSON.stringify(matriz),
                  success: function (datos) {
                        $("#solucion").text(datos.Result)
                        tableProbabilisticResults(datos)
                  },
                  error: function(err){
                        console.log(err);
                        alert("Ocurrio un error");
                  }
            })
            $('html, body').animate({
                  scrollTop: $('#resultados').offset().top
            }, 2000);
      }

      function sensibiltyAnalisis() {
            if(!validarProbabilidades()){
                  return;
            }
            armarMatriz()
            armarProbabilidades()
            //console.log(JSON.stringify(matriz));
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
                  error: function(err){
                        console.log(err);
                        alert("Ocurrio un error");
                  }
            })
            $('html, body').animate({
                  scrollTop: $('#resultados').offset().top
            }, 2000);
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
            g = document.createElement('div')
            g.setAttribute("id", "grafico")
            $("#resultados").html(g)
            Plotly.newPlot('grafico', data);
            $('html, body').animate({
                  scrollTop: $("#grafico").offset().top
            }, 2000);

      }

      function validarProbabilidades(){
            
            if($('#prob1').val() == "" || $('#prob2').val() == ""){
                  alert("Debe indicar los valores de probabilidad");
                  return false;
            }

            var sum = parseFloat($('#prob1').val()) + parseFloat($('#prob2').val());

            if(sum == 0.0 || sum < 1.0 || sum > 1.0){
                  alert("La suma de las probabilidades debe ser 1");
                  return false;
            }
            
            return true;
      }
}))

$('body').ready(function(){
      if(screen.width < 1024){
            $('table').addClass('table-responsive');
      }else{
            $('table').removeClass('table-responsive');
      }
})

$(function () {
      $( "#prob1" ).change(function() {
         var max = parseInt($(this).attr('max'));
         var min = parseInt($(this).attr('min'));
         if ($(this).val() > max)
         {
             $(this).val(max);
         }
         else if ($(this).val() < min)
         {
             $(this).val(min);
         }       
       }); 
       $( "#prob2" ).change(function() {
            var max = parseInt($(this).attr('max'));
            var min = parseInt($(this).attr('min'));
            if ($(this).val() > max)
            {
                $(this).val(max);
            }
            else if ($(this).val() < min)
            {
                $(this).val(min);
            }       
          });
          $( "#alfaVal" ).change(function() {
            var max = parseInt($(this).attr('max'));
            var min = parseInt($(this).attr('min'));
            if ($(this).val() > max)
            {
                $(this).val(max);
            }
            else if ($(this).val() < min)
            {
                $(this).val(min);
            }       
          }); 
   });
