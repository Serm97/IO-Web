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
            $("#metodos").on("change", vistasMetodos)
      })
      function addRow() {
            let filas = '<tr><td scope="row">  <input class="form-control form-control-sm" type="text" value="Alt"> </td><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td></tr>'
            $("#tabledata").append(filas)
      }

      function addColumn(){
            var table = document.getElementById('tabledata');
            var colCount = table.rows[0].cells.length;
            var rowCount = table.rows.length;
            for(var i=0; i<rowCount; i++){            
                 var row = table.rows[i];
                 var col = row.insertCell(colCount);
                 if(i == 0){
                  col.innerHTML = '<th><b>Evento</b></th>';
                 }else{
                  col.innerHTML = '<td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td>';
                 }                                  
            } 
      }

      function deleteColumn(){
            var table = document.getElementById('tabledata');
            var colCount = table.rows[0].cells.length;
            var rowCount = table.rows.length;
            for(var i=0; i<rowCount; i++){            
                 var row = table.rows[i];
                 row.deleteCell(colCount);                                  
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
            $("tbody tr").each(function () {
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
                        break
                  case 2:
                        $("#probablistic").attr('hidden', true)
                        $("#no-probablistic").removeAttr('hidden')
                        $("#alfa").removeAttr('hidden')
                        break
                  default:
                        break
            }
      }
}))
