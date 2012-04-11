package Mojolicious::Plugin::Pedro;

use Mojo::Base 'Mojolicious::Plugin';
use File::Basename 'dirname';
use File::Spec::Functions 'catdir';

our $VERSION = '0.01';

sub register {
    my ( $self, $app ) = @_;

    # Add "templates" and "public" subdirectories to
    # renderer and static paths
    my $base = __FILE__;
    $base =~ s/\.pm//;
    push @{ $app->renderer->paths }, catdir( $base, 'templates' );
    push @{ $app->static->paths },   catdir( $base, 'public' );

    # Prefix /pedro routing
    my $prefix = 'pedro';
    my $routes = $app->routes->waypoint("/$prefix")->to(
        'controller#default',
        namespace  => __PACKAGE__,
        plugin     => $self,
        prefix     => $prefix,
        main_title => 'Pedro!',
    );
    $routes->post('/line_tokens')->to('controller#line_tokens');
}

1;
__END__

=head1 NAME

Mojolicious::Plugin::Pedro - A web-based Perl editor disguised as a Mojolicious plugin :)

=head1 SYNOPSIS

  # Mojolicious
  $self->plugin('Pedro');

  # Mojolicious::Lite
  plugin 'Pedro';

=head1 DESCRIPTION

L<Mojolicious::Plugin::Pedro> is a L<Mojolicious> plugin that provides a simple 
Perl editor that runs inside your favorite browser.

=head1 METHODS

L<Mojolicious::Plugin::Pedro> inherits all methods from
L<Mojolicious::Plugin> and implements the following new ones.

=head2 C<register>

  $plugin->register;

Register plugin in L<Mojolicious> application.

=head1 SEE ALSO

L<Mojolicious>, L<Mojolicious::Guides>, L<http://mojolicio.us>.

=cut
