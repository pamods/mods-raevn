'Returns an array containing all the keys in a given section
Function GetINIKeysList(strFile, strSection)
	Dim objFSO, objIniFile
	Dim strLine, strKey
	Dim intEqualPos, intKeys
	Dim keys()

	intKeys = 0

	Const ForReading = 1

	Set objFSO = CreateObject("Scripting.FileSystemObject")

	If (objFSO.FileExists(strFile)) Then
		Set objIniFile = objFSO.OpenTextFile(strFile, ForReading, False)
		Do While (objIniFile.AtEndOfStream = False)
			strLine = Trim(objIniFile.ReadLine)
			If (strLine = "[" & strSection & "]") Then

				Do While (true)
					If (objIniFile.AtEndOfStream) Then 
						Exit Do
					End If

					strKey = Trim(objIniFile.ReadLine)
					intEqualPos = InStr(1, strKey, "=", 1)

					If (Left(strKey, 1) = "[") Then
						Exit Do
					End If

					If (strKey <> "" And intEqualPos > 0) Then
						strKey = Trim(Left(strKey, intEqualPos - 1))
						ReDim Preserve keys(intKeys)
						keys(intKeys) = strKey
						intKeys = intKeys + 1
					End If
				Loop
				Exit Do
			End If
		Loop
	Else
		'Error
	End If

	GetINIKeysList = keys
End Function

'Returns the value of a key in a given section
Function GetINIKeyValue(strFile, strSection, strKey)
	' This function returns a value read from an INI file
	'
	' Arguments:
	' myFilePath  [string]  the (path and) file name of the INI file
	' mySection   [string]  the section in the INI file to be searched
	' myKey	 [string]  the key whose value is to be returned
	'
	' Returns:
	' the [string] value for the specified key in the specified section
	'
	' CAVEAT: Will return a space if key exists but value is blank
	'
	' Written by Keith Lacelle
	' Modified by Denis St-Pierre and Rob van der Woude

	Const ForReading   = 1
	Const ForWriting   = 2
	Const ForAppending = 8

	Dim intEqualPos
	Dim objFSO, objIniFile
	Dim strFilePath, strLeftString, strLine

	Set objFSO = CreateObject( "Scripting.FileSystemObject" )

	ReadIni = ""
	strFilePath = Trim( strFile )
	strSection  = Trim( strSection )
	strKey = Trim( strKey )

	If objFSO.FileExists( strFilePath ) Then
		Set objIniFile = objFSO.OpenTextFile( strFilePath, ForReading, False )
		Do While objIniFile.AtEndOfStream = False
			strLine = Trim( objIniFile.ReadLine )

			' Check if section is found in the current line
			If LCase( strLine ) = "[" & LCase( strSection ) & "]" Then
				strLine = Trim( objIniFile.ReadLine )

				' Parse lines until the next section is reached
				Do While Left( strLine, 1 ) <> "["
					' Find position of equal sign in the line
					intEqualPos = InStr( 1, strLine, "=", 1 )
					If intEqualPos > 0 Then
						strLeftString = Trim( Left( strLine, intEqualPos - 1 ) )
						' Check if item is found in the current line
						If LCase( strLeftString ) = LCase( strKey ) Then
							GetINIKeyValue = Trim( Mid( strLine, intEqualPos + 1 ) )
							' In case the item exists but value is blank
							If GetINIKeyValue = "" Then
								GetINIKeyValue = " "
							End If
							' Abort loop when item is found
							Exit Do
						End If
					End If

					' Abort if the end of the INI file is reached
					If objIniFile.AtEndOfStream Then Exit Do

					' Continue with next line
					strLine = Trim( objIniFile.ReadLine )
				Loop
				Exit Do
			End If
		Loop
		objIniFile.Close
	Else
		msgbox strFilePath & " doesn't exist. Exiting..."
		Wscript.Quit 1
	End If
End Function
