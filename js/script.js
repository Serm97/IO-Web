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
            matriz.matriz = matrizAux
      }

      function maximin() {
            armarMatriz()
            $.ajax({
                  type: "POST", 
                  crossDomain: true,
                  dataType: 'json',
                  url: "https://invoperacionesapi.azurewebsites.net/api/Metodos/GetWaldCriterion",
                  data: matriz, 
                  success: function (datos) {
                        console.log(datos)
                  },
            })
      }
}))
