// Type: PCTNTControl.ClsNTControl
// Assembly: PCTNTControl, Version=2.5.3.0, Culture=neutral, PublicKeyToken=null
// Implementation from "Early Warning Software" (PCTNTControl.dll) by Panasonic

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Threading;

namespace PCTNTControl
{
  internal class ClsNTControl : tcpcomm
  {
    private readonly List<string> _errorResponseList = new List<string>()
    {
      "ERR1",
      "ERR2",
      "ERR3",
      "ERR4",
      "ERR5"
    };
    private MD5CryptoServiceProvider _md5 = new MD5CryptoServiceProvider();
    private byte[] _sendBytes = new byte[256];
    private byte[] _recvBytes = new byte[256];
    private const string RES_PASSWORD_ON = "NTCONTROL 1 ";
    private const string RES_PASSWORD_OFF = "NTCONTROL 0";
    private const string RES_PDP_PASSWORD_ON = "PDPCONTROL 1 ";
    private const string RES_PDP_PASSWORD_OFF = "PDPCONTROL 0";
    private const string PASSWORD_ERROR = "ERRA";
    private const int DEFAULT_NTCONTROL_PORT = 1024;
    private const int NTCONTROL_TIMEOUT = 30000;
    private const int NTCONTROL_RECEIVE_WAIT_TIME = 200;
    private const int NTCONTROL_RECEIVE_WAIT_TIME_MAX = 20000;
    private const int MAX_RECIEVE_SIZE = 1024;
    private const string BIN_COMMAND_FORMAT = "01{0}\r";
    private const string BIN_COMMAND2_FORMAT = "01{0}";
    public const byte FIRST_BYTE = 48;
    public const byte SECOND_BYTE = 49;
    private const int MIS_MAX_RECIEVE_SIZE = 1024;
    private const string MIS_COMMAND_FORMAT = "00{0}\r";
    private const string MIS_COMMAND2_FORMAT = "00{0}";
    public const byte MIS_FIRST_BYTE = 48;
    public const byte MIS_SECOND_BYTE = 48;
    private const string querySelfDiagnosisCmd = "0200fefe03";
    private const string querySetRumTimeCmd = "02008e0303";
    private const string queryPowerOnCountCmd = "02008e0303";
    private const string queryPowerOnCountExtCmd = "02008e1303";
    private const string queryInputSignalCmd = "0200fbaa03";
    private const string querySubMiconVerCmd = "02008b03";
    private const string querySubMiconVerMISCmd = "QRV:STB";
    private const string querySerialNumberCmd = "QSN";
    private const string queryFanTargetRpmCmd = "QVX:FRTI";
    private const string queryFanRegularRpmCmd = "QVX:FRRI";
    private const string queryFanWarningRpmCmd = "QVX:FTRI";
    private const string queryPowerSaveSetCmd = "QVX:ECSI1";
    private const string queryBoardTempCmd = "QVX:TMBS";
    private const string queryExhaustTempCmd = "QVX:TMES";
    private const string queryIntakeTempCmd = "QVX:TMIS";
    private const string queryPanelTempCmd = "QVX:TMPS";
    private const string queryBoardWarmingTempCmd = "QVX:TTBS";
    private const string queryExhaustWarningTempCmd = "QVX:TTES";
    private const string queryIntakeWarningTempCmd = "QVX:TTIS";
    private const string queryPanelWarningTempCmd = "QVX:TTPS";
    private const string queryFPContentsSendStartCmd = "SUS:CST";
    private const string queryFPContentsSendEndCmd = "SUS:CED";
    private const string queryFPContentsResetCmd = "SUS:CRS";
    private const string queryFPContentsMediaPlayerInfoCmd = "QUS:MPT";
    private const string queryUSBMemoryTotalMISCmd = "QUS:ASZ";
    private const string queryUSBMemoryNotUsedMISCmd = "QUS:RSZ";
    private const string queryUSBMemoryUsedMISCmd = "QUS:USZ";
    private const string queryUSBMemoryTotalMIS2Cmd = "QVX:MTSS1";
    private const string queryUSBMemoryNotUsedMIS2Cmd = "QVX:MDSS1";
    private const string queryUSBMemoryUsedMIS2Cmd = "QVX:MUSS1";
    private const string queryUSBMemoryStatusMIS2Cmd = "QVX:MSTI1";
    private const string COMMAND_EQUAL = "=";
    private const string RECV_UNDEFINED = "ERR1";
    private const string RECV_OUTOFRANGE = "ERR2";
    private const string RECV_TIMEOUT = "ERR3";
    private const string RECV_ABNORMAL = "ERR4";
    private new TcpClient _tcp;
    private new NetworkStream _ns;

    public int Connect(ClsNTControlFPInfo fpInfo, bool checkModel, out string hashcode)
    {
      int num = 0;
      hashcode = string.Empty;
      try
      {
        string empty = string.Empty;
        this._tcp = new TcpClient();
        this._tcp.Connect(fpInfo.IPAddress, this.PortNumber);
        this._ns = this._tcp.GetStream();
        this._ns.ReadTimeout = 30000;
        this._ns.WriteTimeout = 30000;
        string recvCommand = this.GetRecvCommand(false);
        string upper = recvCommand.ToUpper();
        if (upper.IndexOf("NTCONTROL 1 ") != -1 || upper.IndexOf("PDPCONTROL 1 ") != -1)
        {
          string str = recvCommand.Substring(12, 8);
          hashcode = this.md5Encrypt(string.Format("{0}:{1}:{2}", (object) fpInfo.User, (object) fpInfo.Password, (object) str));
          num = 0;
        }
        else if (upper.IndexOf("ERRA") != -1 || upper.IndexOf("NTCONTROL 0") != -1 || upper.IndexOf("PDPCONTROL 0") != -1)
        {
          hashcode = string.Empty;
        }
        else
        {
          this.Disconnect();
          return -14;
        }
      }
      catch
      {
        num = -11;
      }
      if (num != 0)
        this.Disconnect();
      return num;
    }

    public int Disconnect()
    {
      if (this._ns != null)
        this._ns.Close();
      if (this._tcp != null)
        this._tcp.Close();
      return 0;
    }

    private string GetRecvCommand(bool encUTF8)
    {
      string empty1 = string.Empty;
      int num = 0;
      try
      {
        while (true)
        {
          string empty2 = string.Empty;
          int count = this._ns.Read(this._recvBytes, 0, this._recvBytes.Length);
          string str = !encUTF8 ? Encoding.ASCII.GetString(this._recvBytes, 0, count) : Encoding.UTF8.GetString(this._recvBytes, 0, count);
          empty1 += str;
          if (str.LastIndexOf('\r') == -1)
          {
            if (num < 20000)
            {
              Thread.Sleep(200);
              num += 200;
            }
            else
              break;
          }
          else
            goto label_6;
        }
        empty1 = string.Empty;
      }
      catch
      {
        empty1 = string.Empty;
      }
label_6:
      return empty1;
    }

    private string MakeNTControlCommand(EnuNTControlCommand commandInfo)
    {
      string str1 = string.Empty;
      string str2 = string.Empty;
      switch (commandInfo)
      {
        case EnuNTControlCommand.SELFDIAG128:
          str2 = string.Format("01{0}\r", (object) "0200fefe03");
          break;
        case EnuNTControlCommand.SETRUNTIME:
          str2 = string.Format("01{0}\r", (object) "02008e0303");
          break;
        case EnuNTControlCommand.POWER_ON_COUNT:
          str2 = string.Format("01{0}\r", (object) "02008e0303");
          break;
        case EnuNTControlCommand.SERIAL_NUMBER:
          str2 = string.Format("00{0}\r", (object) "QSN");
          break;
        case EnuNTControlCommand.FAN_TARGET:
          str2 = string.Format("00{0}", (object) "QVX:FRTI");
          break;
        case EnuNTControlCommand.FAN_REGULAR:
          str2 = string.Format("00{0}", (object) "QVX:FRRI");
          break;
        case EnuNTControlCommand.FAN_WARNING:
          str2 = string.Format("00{0}", (object) "QVX:FTRI");
          break;
        case EnuNTControlCommand.INPUT_INFO:
          str2 = string.Format("01{0}\r", (object) "0200fbaa03");
          break;
        case EnuNTControlCommand.POWER_SAVE_SETTING:
          str2 = string.Format("00{0}\r", (object) "QVX:ECSI1");
          break;
        case EnuNTControlCommand.BOARD_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TMBS");
          break;
        case EnuNTControlCommand.EXHAUST_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TMES");
          break;
        case EnuNTControlCommand.INTAKE_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TMIS");
          break;
        case EnuNTControlCommand.PANEL_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TMPS");
          break;
        case EnuNTControlCommand.BOARD_WARNING_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TTBS");
          break;
        case EnuNTControlCommand.EXHAUST_WARNING_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TTES");
          break;
        case EnuNTControlCommand.INTAKE_WARNING_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TTIS");
          break;
        case EnuNTControlCommand.PANEL_WARNING_TEMP:
          str2 = string.Format("00{0}", (object) "QVX:TTPS");
          break;
        case EnuNTControlCommand.SUB_VERSION:
          str2 = string.Format("01{0}\r", (object) "02008b03");
          break;
        case EnuNTControlCommand.SUB_VERSION_MIS:
          str2 = string.Format("00{0}\r", (object) "QRV:STB");
          break;
        case EnuNTControlCommand.USB_MEMORY_TOTAL:
          str2 = string.Format("00{0}\r", (object) "QVX:MTSS1");
          break;
        case EnuNTControlCommand.USB_MEMORY_USED:
          str2 = string.Format("00{0}\r", (object) "QVX:MUSS1");
          break;
        case EnuNTControlCommand.USB_MEMORY_NOTUSED:
          str2 = string.Format("00{0}\r", (object) "QVX:MDSS1");
          break;
        case EnuNTControlCommand.USB_MEMORY_STATUS:
          str2 = string.Format("00{0}\r", (object) "QVX:MSTI1");
          break;
        case EnuNTControlCommand.POWER_ON_COUNT_EXT:
          str2 = string.Format("01{0}\r", (object) "02008e1303");
          break;
        case EnuNTControlCommand.FP_CONTENTS_ST:
          str2 = string.Format("00{0}\r", (object) "SUS:CST");
          break;
        case EnuNTControlCommand.FP_CONTENTS_ED:
          str2 = string.Format("00{0}\r", (object) "SUS:CED");
          break;
        case EnuNTControlCommand.FP_MEDIAPLAYER_INFO:
          str2 = string.Format("00{0}\r", (object) "QUS:MPT");
          break;
        case EnuNTControlCommand.FP_MEDIAPLAYER_RST:
          str2 = string.Format("00{0}\r", (object) "SUS:CRS");
          break;
      }
      if (!string.IsNullOrEmpty(str2))
        str1 = str2;
      return str1;
    }

    public int GetNTControlInfo(
      EnuNTControlCommand commandInfo,
      string hashcode,
      ref string recvInfo,
      int index)
    {
      int num = 0;
      string empty1 = string.Empty;
      string empty2 = string.Empty;
      try
      {
        string str1 = this.MakeNTControlCommand(commandInfo);
        string s = index == 0 ? string.Format("{0}{1}", (object) hashcode, (object) str1) : string.Format("{0}{1}{2}\r", (object) hashcode, (object) str1, (object) index.ToString("X").ToUpper());
        if (string.IsNullOrEmpty(s))
          return -12;
        this._sendBytes = Encoding.ASCII.GetBytes(s);
        this._ns.Write(this._sendBytes, 0, this._sendBytes.Length);
        string recvCommand = this.GetRecvCommand(false);
        if (recvCommand.Length == 0 || recvCommand[recvCommand.Length - 1] != '\r')
          throw new Exception();
        string str2 = recvCommand.TrimEnd('\r');
        if (str2 != string.Empty)
        {
          recvInfo = str2.Substring(str2.IndexOf("=") + 1);
        }
        else
        {
          num = -11;
          recvInfo = string.Empty;
        }
      }
      catch
      {
        num = -11;
        recvInfo = string.Empty;
      }
      return num;
    }

    public int SetNTControlInfo(string commandInfo, string hashcode, bool binType, int index)
    {
      int num = 0;
      string empty1 = string.Empty;
      string empty2 = string.Empty;
      try
      {
        string str = commandInfo;
        string s = index == 0 ? string.Format("{0}{1}", (object) hashcode, (object) str) : string.Format("{0}{1}{2}\r", (object) hashcode, (object) str, (object) index.ToString("X").ToUpper());
        if (string.IsNullOrEmpty(s))
          return -12;
        this._sendBytes = Encoding.ASCII.GetBytes(s);
        this._ns.Write(this._sendBytes, 0, this._sendBytes.Length);
      }
      catch
      {
        num = -11;
      }
      return num;
    }

    private CommResult initialize(out string hashcode)
    {
      hashcode = string.Empty;
      byte[] message = (byte[]) null;
      if (!this.recvMessage(ref message, 256, 200, 20000))
        return CommResult.NetworkError;
      string strA = Encoding.ASCII.GetString(message);
      if (string.Compare(strA, 0, "NTCONTROL 1 ", 0, "NTCONTROL 1 ".Length, true) == 0 || string.Compare(strA, 0, "PDPCONTROL 1 ", 0, "PDPCONTROL 1 ".Length, true) == 0)
      {
        string str = Encoding.ASCII.GetString(message).Substring(12, 8);
        hashcode = this.md5Encrypt(string.Format("{0}:{1}:{2}", (object) this._user, (object) this._password, (object) str));
      }
      else
      {
        if (string.Compare(strA, 0, "NTCONTROL 0", 0, "NTCONTROL 0".Length, true) != 0 && string.Compare(strA, 0, "PDPCONTROL 0", 0, "PDPCONTROL 0".Length, true) != 0)
          return CommResult.Error;
        hashcode = string.Empty;
        if (!string.IsNullOrEmpty(this._password))
          return CommResult.PasswordError;
      }
      return CommResult.Success;
    }

    private string md5Encrypt(string key)
    {
      string empty = string.Empty;
      byte[] bytes = Encoding.ASCII.GetBytes(key);
      using (MD5CryptoServiceProvider cryptoServiceProvider = new MD5CryptoServiceProvider())
      {
        byte[] hash = cryptoServiceProvider.ComputeHash(bytes);
        StringBuilder stringBuilder = new StringBuilder();
        foreach (byte num in hash)
          stringBuilder.Append(num.ToString("X2"));
        return stringBuilder.ToString();
      }
    }

    private bool checkPasswordError(byte[] response)
    {
      string strA = Encoding.ASCII.GetString(response);
      bool flag = true;
      if (string.Compare(strA, 0, "ERRA", 0, "ERRA".Length, true) == 0)
        flag = false;
      return flag;
    }

    private bool checkErrorResponse(byte[] response)
    {
      bool flag = true;
      string strA = Encoding.ASCII.GetString(response);
      for (int index = 0; index < this._errorResponseList.Count; ++index)
      {
        string errorResponse = this._errorResponseList[index];
        if (string.Compare(strA, 0, errorResponse, 0, errorResponse.Length, true) == 0)
        {
          flag = false;
          break;
        }
      }
      return flag;
    }

    protected void sendMessage(byte[] message)
    {
      this._ns.Write(message, 0, message.Length);
      this._ns.Flush();
    }

    protected bool recvMessage(
      ref byte[] message,
      int receiveSize,
      int receiveWaitTime,
      int receiveWaitTimeMax)
    {
      bool flag = false;
      byte[] buffer = new byte[receiveSize];
      int offset = 0;
      try
      {
        Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();
        while (stopwatch.ElapsedMilliseconds < (long) receiveWaitTimeMax)
        {
          int num1 = this._ns.Read(buffer, offset, buffer.Length - offset);
          int num2 = 0;
          while (num2 < num1)
          {
            if ((byte) 13 == buffer[offset])
            {
              flag = true;
              break;
            }
            ++num2;
            ++offset;
          }
          if (flag)
          {
            message = new byte[offset + 1];
            Array.Copy((Array) buffer, (Array) message, message.Length);
            break;
          }
          Thread.Sleep(receiveWaitTime);
        }
      }
      catch (Exception ex)
      {
      }
      finally
      {
      }
      return flag;
    }
  }
}
