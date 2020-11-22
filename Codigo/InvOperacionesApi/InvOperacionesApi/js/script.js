(function (yourCode) {
      yourCode(window.jQuery, window, document)
}(function ($, window) {
      let matriz = {}
      let matrizAux = []
      $(function () {
            $("#aumentar-fila").on('click', addRow)
            $("#eliminar-fila").on('click', deleteRow)
            $("#maximin").on('click', maximin)
      })
      function addRow() {
            let filas = '<tr><th scope="row">  <input class="form-control form-control-sm" type="text" value="Alt"> </th><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td></tr>'
            $("#tabledata").append(filas)
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
            matriz.Matriz = 
                  [
                     [
                         "Alt/Est",
                         "Aeropuerto A",
                         "Aeropuerto B"
                     ],
                     [
                         "A",
                         "13",
                         "-12"
                     ],
                     [
                         "B",
                         "-8",
                         "11"
                     ],
                     [
                         "A&B",
                         "5",
                         "-1"
                     ],
                     [
                         "NINGUNO",
                         "0",
                         "0"
                     ]
                 ]
             ;
      }

      function maximin() {
            armarMatriz()
            $.ajax({
                  type: "GET", 
                  crossDomain: true,
                  dataType: 'json',
                  //url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetWaldCriterion",
                  url: "http://localhost:7864/api/Metodos/GetWaldCriterion",
                  data: matriz, 
                  success: function (datos) {
                        console.log(datos)
                  },
            })
      }
}))
