#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
# Added this to include Node.js for frontend build
RUN bash -E $(curl -fsSL https://deb.nodesource.com/setup_18.x | bash - ); apt install -y nodejs
# The WORKDIR instruction sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD instructions that follow it in the Dockerfile. If the WORKDIR doesn’t exist, it will be created even if it’s not used in any subsequent Dockerfile instruction.
WORKDIR /src
COPY ["lastpass_clone.client/nuget.config", "lastpass_clone.client/"]
COPY ["LastPass_Clone.Server/PasswordManager.Server.csproj", "LastPass_Clone.Server/"]
COPY ["lastpass_clone.client/PasswordManager.Client.esproj", "lastpass_clone.client/"]
RUN dotnet restore "./LastPass_Clone.Server/PasswordManager.Server.csproj"
COPY . .
WORKDIR "/src/LastPass_Clone.Server"
RUN dotnet build "./PasswordManager.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./PasswordManager.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PasswordManager.Server.dll"]