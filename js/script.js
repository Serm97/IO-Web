function addRow() {
      document.getElementById("tabledata").insertRow(-1).innerHTML = '<tr><th scope="row">  <input class="form-control form-control-sm" type="text" value="Alt"> </th><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td><td>  <input class="form-control form-control-sm" type="text" placeholder="Ingrese el valor"> </td></tr>';
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

function createMatrix(){
      var table = document.getElementById("tabledata");
      var obj = {
            "Matriz": [],
            "Alfa": ""
      }

      for (let i = 1; i < table.rows.length; i++) {
            
            //table.rows[i]
            
            
            
      }

      obj.Matriz.push
}

function maximax(){
      $.ajax({
            method: "POST",
            url: "http:/"
          }).done(function(data) {
            alert(data); // imprimimos la respuesta
          }).fail(function() {
            alert("Algo salió mal");
          }).always(function() {
            alert("Siempre se ejecuta")
          });
}