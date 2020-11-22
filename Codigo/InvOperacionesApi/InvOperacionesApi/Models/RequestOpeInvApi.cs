using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InvOperacionesApi.Models
{
    
    public class RequestOpeInvApi
    {
        public string[,] Matriz { get; set; }
        public double Alfa { get; set; }
    }
}