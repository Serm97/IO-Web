using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InvOperacionesApi.Models
{
    public class ResponseProbabilisticMethod
    {
        public string[,] Matriz { get; set; }
        public string Result { get; set; }
    }
}